import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          Privacy Policy
        </h1>

        <p className="text-gray-500 mb-8">
          Last updated: August 27, 2026
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            1. Introduction
          </h2>

          <p>
            Welcome to CareerFlow. We respect your privacy and are
            committed to protecting your personal information. This
            Privacy Policy explains how we collect, use, and protect
            information when you use our website and services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            2. Information We Collect
          </h2>

          <p className="mb-3">
            We may collect information that you provide when using
            CareerFlow, including:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Name and email address</li>
            <li>Google account information when you sign in with Google</li>
            <li>Information you voluntarily provide while using the application</li>
            <li>Basic technical information required to operate the service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            3. How We Use Information
          </h2>

          <p>
            We use collected information to provide and improve
            CareerFlow, authenticate users, maintain account security,
            and provide the features of the application.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            4. Google Sign-In
          </h2>

          <p>
            CareerFlow may use Google Sign-In for authentication.
            When you choose to sign in with Google, we may receive
            basic account information permitted by Google's
            authentication service, such as your name, email address,
            and profile information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            5. Data Security
          </h2>

          <p>
            We take reasonable measures to protect your information
            from unauthorized access, alteration, disclosure, or
            destruction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            6. Third-Party Services
          </h2>

          <p>
            CareerFlow may use third-party services such as Google
            authentication and hosting or infrastructure providers.
            These services may process information according to their
            own privacy policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            7. Your Rights
          </h2>

          <p>
            You may request information about your personal data or
            request deletion of your account information where
            applicable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            8. Contact Us
          </h2>

          <p>
            If you have questions about this Privacy Policy, please
            contact us through the contact information provided on
            the CareerFlow website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            9. Changes to This Privacy Policy
          </h2>

          <p>
            We may update this Privacy Policy from time to time.
            Any changes will be posted on this page with an updated
            revision date.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;