import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { RecipientInput } from '../components/composer/RecipientInput';
import { RichTextEditor } from '../components/composer/RichTextEditor';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import { useGmail } from '../hooks/useGmail';
import { useAuth } from '../hooks/useAuth';
import { isValidEmail, validateEmailList } from '../utils/emailValidation';
import { resolveVariables } from '../utils/emailVariables';
import { findContactByEmail, emailsSentTo, lastContactedAt } from '../services/contactService';
import { recordOutreach } from '../services/outreachService';
import * as gmailService from '../services/gmailService';
import { addDays, formatDate } from '../utils/formatDate';

export default function Compose() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { connected, profile, developmentMode } = useGmail();
  const { user } = useAuth();

  const [to, setTo] = useState(searchParams.get('to') ?? '');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const t = searchParams.get('to');
    if (t) setTo(t);
  }, [searchParams]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        void handleSendClick();
      }
      if (e.key === 'Escape' && confirmOpen) setConfirmOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, subject, body, cc, bcc, confirmOpen]);

  const toContact = useMemo(() => (isValidEmail(to) ? findContactByEmail(to) : undefined), [to]);
  const priorCount = useMemo(() => (isValidEmail(to) ? emailsSentTo(to) : 0), [to, body]);
  const lastSent = useMemo(() => (isValidEmail(to) ? lastContactedAt(to) : null), [to, body]);

  const variableCtx = {
    firstName: toContact?.name.split(' ')[0],
    company: toContact?.company,
    role: toContact?.role,
    senderName: user?.name,
  };

  const validate = (): string | null => {
    if (!isValidEmail(to)) return 'Enter a valid recipient email address.';
    const ccResult = validateEmailList(cc);
    if (ccResult.invalid.length > 0) return `Invalid CC address: ${ccResult.invalid[0]}`;
    const bccResult = validateEmailList(bcc);
    if (bccResult.invalid.length > 0) return `Invalid BCC address: ${bccResult.invalid[0]}`;
    if (!subject.trim()) return 'Subject is required.';
    if (!body.trim() || body === '<br>') return 'Email body cannot be empty.';
    return null;
  };

  const handleSendClick = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    if (priorCount > 0) {
      setConfirmOpen(true);
      return;
    }
    await performSend();
  };

  const performSend = async () => {
    setConfirmOpen(false);
    setSending(true);
    setError(null);

    const resolvedSubject = resolveVariables(subject, variableCtx);
    const resolvedBody = resolveVariables(body, variableCtx);
    const ccList = validateEmailList(cc).valid;
    const bccList = validateEmailList(bcc).valid;

    let status: 'sent' | 'failed' | 'demo' = 'demo';
    let gmailMessageId: string | null = null;
    let threadId: string | null = null;

    if (connected) {
      const result = await gmailService.sendEmail({ to, cc: ccList, bcc: bccList, subject: resolvedSubject, html: resolvedBody });
      if (result.success) {
        status = 'sent';
        gmailMessageId = result.messageId;
        threadId = result.threadId;
      } else {
        status = 'failed';
        setError(result.error ?? 'Email could not be sent.');
      }
    }

    recordOutreach({
      contactId: toContact?.id ?? null,
      recipient: to.trim().toLowerCase(),
      cc: ccList,
      bcc: bccList,
      sender: profile?.email ?? 'demo.mode@careerflow.app',
      subject: resolvedSubject,
      body: resolvedBody,
      company: toContact?.company ?? '',
      jobTitle: toContact?.role ?? '',
      sentAt: new Date().toISOString(),
      status,
      followUpAt: status === 'failed' ? null : addDays(new Date().toISOString(), 4),
      gmailMessageId,
      threadId,
    });

    setSending(false);

    if (status === 'sent') {
      showToast('Email sent successfully ✓', 'success');
      clearComposer();
      navigate('/outreach');
    } else if (status === 'demo') {
      showToast('Demo email saved locally.', 'info');
      clearComposer();
      navigate('/outreach');
    } else {
      showToast('Email could not be sent.', 'error');
    }
  };

  const clearComposer = () => {
    setTo('');
    setCc('');
    setBcc('');
    setSubject('');
    setBody('');
    setShowCc(false);
    setShowBcc(false);
  };

  const handleSaveDraft = () => {
    showToast('Draft saved locally.', 'info');
  };

  const handleDiscard = () => {
    clearComposer();
    showToast('Draft discarded.', 'info');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-white">Compose Email</h1>
        <p className="mt-1 text-sm text-muted">Write a personalized outreach email. Use variables like {'{{firstName}}'}.</p>
      </div>

      {developmentMode && (
        <Card className="border-warning/30 bg-warning/5">
          <p className="text-sm font-medium text-warning">Demo Mode</p>
          <p className="mt-1 text-sm text-muted">This email will not be sent through Gmail. Connect Gmail to send real emails.</p>
        </Card>
      )}

      <Card className="space-y-4">
        <div>
          <p className="mb-1.5 text-sm font-medium text-white">From</p>
          <div className="rounded-lg border border-border bg-card-secondary px-3.5 py-2.5 text-sm text-muted">
            {connected && profile ? profile.email : 'Connect Gmail to send real emails.'}
          </div>
        </div>

        <RecipientInput label="To" value={to} onChange={setTo} placeholder="recruiter@example.com" showContactHint />

        <div className="flex gap-4 text-sm">
          {!showCc && (
            <button onClick={() => setShowCc(true)} className="focus-ring rounded text-muted hover:text-white">+ CC</button>
          )}
          {!showBcc && (
            <button onClick={() => setShowBcc(true)} className="focus-ring rounded text-muted hover:text-white">+ BCC</button>
          )}
        </div>

        {showCc && <Input label="CC" value={cc} onChange={(e) => setCc(e.target.value)} placeholder="comma-separated emails" />}
        {showBcc && <Input label="BCC" value={bcc} onChange={(e) => setBcc(e.target.value)} placeholder="comma-separated emails" />}

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="subject" className="text-sm font-medium text-white">Subject</label>
            <span className="text-xs text-muted">{subject.length} characters</span>
          </div>
          <input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Application for Software Engineer Internship"
            className="focus-ring w-full rounded-lg border border-border bg-card-secondary px-3.5 py-2.5 text-sm text-white placeholder:text-muted focus:border-primary"
          />
        </div>

        <div>
          <p className="mb-1.5 text-sm font-medium text-white">Body</p>
          <RichTextEditor value={body} onChange={setBody} placeholder="Hi {{firstName}}, I'm reaching out about..." />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <Button variant="ghost" onClick={handleDiscard} type="button">Discard</Button>
            <Button variant="secondary" onClick={handleSaveDraft} type="button">Save Draft</Button>
          </div>
          <Button onClick={handleSendClick} loading={sending} type="button">
            {sending ? 'Sending…' : connected ? 'Send Email' : 'Send Demo Email'}
          </Button>
        </div>
        <p className="text-right text-[11px] text-muted">Ctrl/Cmd + Enter to send</p>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Already Contacted"
        message={`You've already contacted this person ${priorCount} time${priorCount === 1 ? '' : 's'}.${lastSent ? ` Last email: ${formatDate(lastSent)}.` : ''}`}
        confirmLabel="Send Anyway"
        onConfirm={performSend}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
