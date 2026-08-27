import { useState } from 'react';
import { isValidEmail } from '../../utils/emailValidation';
import { findContactByEmail, emailsSentTo } from '../../services/contactService';
import { Badge } from '../ui/Badge';

interface RecipientInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showContactHint?: boolean;
}

export function RecipientInput({ label, value, onChange, placeholder, showContactHint }: RecipientInputProps) {
  const [touched, setTouched] = useState(false);
  const trimmed = value.trim();
  const valid = trimmed === '' || isValidEmail(trimmed);
  const contact = trimmed && isValidEmail(trimmed) ? findContactByEmail(trimmed) : undefined;
  const sentCount = contact ? emailsSentTo(contact.email) : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-white">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
        className={`focus-ring w-full rounded-lg border bg-card-secondary px-3.5 py-2.5 text-sm text-white placeholder:text-muted transition-colors ${
          touched && !valid ? 'border-danger' : 'border-border focus:border-primary'
        }`}
      />
      {touched && !valid && <span className="text-xs text-danger">Enter a valid email address.</span>}
      {showContactHint && contact && (
        <div className="flex items-center gap-2">
          <Badge tone="primary">Existing Contact</Badge>
          <span className="text-xs text-muted">{sentCount} email{sentCount === 1 ? '' : 's'} previously sent</span>
        </div>
      )}
    </div>
  );
}
