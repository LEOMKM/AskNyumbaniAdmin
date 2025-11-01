'use client'

import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-primary to-primary/90 text-white shadow-2xl">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-5xl font-bold mb-2 animate-fade-in">Privacy Policy</h1>
          <p className="text-lg text-white/90 animate-slide-in">Ask Nyumbani Real Estate Platform</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-8 animate-fade-in">

          {/* Last Updated */}
          <div className="text-sm text-muted-foreground border-l-4 border-primary pl-4">
            <p className="font-semibold">Last Updated: November 1, 2025</p>
            <p className="mt-1">Effective Date: November 1, 2025</p>
          </div>

          {/* Introduction */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to Ask Nyumbani, Kenya's premier real estate mobile application developed by Codzure Solutions Limited ("we," "our," or "us").
              We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how
              we collect, use, disclose, and safeguard your information when you use our mobile application and services.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              By using Ask Nyumbani, you agree to the collection and use of information in accordance with this policy. If you do not agree with
              our policies and practices, please do not use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Information We Collect</h2>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">1. Personal Information</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Register for an account</li>
              <li>List a property on our platform</li>
              <li>Contact property owners</li>
              <li>Submit inquiries or feedback</li>
              <li>Subscribe to our newsletters or notifications</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              This information may include:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Name and contact information (email address, phone number)</li>
              <li>Property listing details (address, price, description)</li>
              <li>Photos and images of properties</li>
              <li>User-generated content (property descriptions, reviews)</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">2. Location Information</h3>
            <p className="text-muted-foreground leading-relaxed">
              With your permission, we collect and process information about your location using GPS and network-based location services.
              This enables us to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-3">
              <li>Show you properties near your current location</li>
              <li>Provide GPS-based property search within a 50km radius</li>
              <li>Display properties on Google Maps</li>
              <li>Improve search relevance based on your area</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              You can disable location services at any time through your device settings, though this may limit certain features of the app.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">3. Automatically Collected Information</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              When you use Ask Nyumbani, we automatically collect certain information about your device and usage, including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Device information (model, operating system, unique device identifiers)</li>
              <li>App usage data (features used, time spent, interactions)</li>
              <li>Log data (IP address, access times, pages viewed)</li>
              <li>Crash reports and diagnostic information</li>
              <li>Analytics data (via Firebase Analytics)</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We use the collected information for various purposes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Service Delivery:</strong> To provide, maintain, and improve our real estate platform</li>
              <li><strong>Property Listings:</strong> To display and manage property listings with accurate location data</li>
              <li><strong>Communication:</strong> To connect property buyers with sellers and enable property inquiries</li>
              <li><strong>Personalization:</strong> To customize your experience and show relevant properties</li>
              <li><strong>Location Services:</strong> To enable GPS-based search and map functionality</li>
              <li><strong>Analytics:</strong> To understand how users interact with our app and improve features</li>
              <li><strong>Security:</strong> To detect, prevent, and address technical issues and fraudulent activity</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms</li>
              <li><strong>Communication:</strong> To send you updates, notifications, and promotional content (with your consent)</li>
            </ul>
          </section>

          {/* Data Storage and Security */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Data Storage and Security</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We take the security of your data seriously and implement appropriate technical and organizational measures:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Secure Storage:</strong> Data is stored on Supabase servers with industry-standard encryption</li>
              <li><strong>Data in Transit:</strong> All data transmitted between your device and our servers is encrypted using SSL/TLS</li>
              <li><strong>Access Controls:</strong> Strict access controls ensure only authorized personnel can access your data</li>
              <li><strong>Regular Backups:</strong> We maintain regular backups to prevent data loss</li>
              <li><strong>Monitoring:</strong> Continuous monitoring for security threats and vulnerabilities</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              <strong>Note:</strong> While we strive to protect your personal information, no method of transmission over the internet or electronic
              storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          {/* Data Sharing and Disclosure */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Data Sharing and Disclosure</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">1. With Your Consent</h3>
            <p className="text-muted-foreground leading-relaxed">
              When you list a property, your contact information may be shared with potential buyers or interested parties to facilitate property inquiries.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">2. Service Providers</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We may share information with trusted third-party service providers who assist us in operating our app:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Supabase:</strong> Backend infrastructure and database hosting</li>
              <li><strong>Google Maps:</strong> Location services and mapping functionality</li>
              <li><strong>Firebase:</strong> Analytics, crash reporting, and performance monitoring</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              These service providers are bound by confidentiality agreements and are prohibited from using your data for any other purpose.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">3. Legal Requirements</h3>
            <p className="text-muted-foreground leading-relaxed">
              We may disclose your information if required by law or in response to valid requests by public authorities (e.g., court orders,
              government regulations, law enforcement).
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">4. Business Transfers</h3>
            <p className="text-muted-foreground leading-relaxed">
              If Codzure Solutions Limited is involved in a merger, acquisition, or asset sale, your personal information may be transferred.
              We will provide notice before your data is transferred and becomes subject to a different privacy policy.
            </p>
          </section>

          {/* Your Rights and Choices */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Your Rights and Choices</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-3 ml-4">
              <li><strong>Access:</strong> You can request access to the personal information we hold about you</li>
              <li><strong>Correction:</strong> You can request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> You can request deletion of your personal information, subject to legal obligations</li>
              <li><strong>Objection:</strong> You can object to processing of your personal information for certain purposes</li>
              <li><strong>Data Portability:</strong> You can request a copy of your data in a structured, machine-readable format</li>
              <li><strong>Withdraw Consent:</strong> You can withdraw consent for data processing at any time</li>
              <li><strong>Location Services:</strong> You can enable or disable location services in your device settings</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              To exercise these rights, please contact us at: <a href="mailto:support@codzuresolutions.com" className="text-primary hover:underline font-medium">support@codzuresolutions.com</a>
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ask Nyumbani is not intended for use by children under the age of 13. We do not knowingly collect personal information from
              children under 13. If you become aware that a child has provided us with personal information, please contact us immediately.
              If we discover that we have collected personal information from a child under 13, we will delete that information promptly.
            </p>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Cookies and Tracking Technologies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Our app may use cookies and similar tracking technologies to enhance your experience:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Analytics Cookies:</strong> To understand how users interact with our app (via Firebase Analytics)</li>
              <li><strong>Functional Cookies:</strong> To remember your preferences and settings</li>
              <li><strong>Performance Cookies:</strong> To monitor app performance and identify issues</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              You can control cookie settings through your device settings, though disabling cookies may affect app functionality.
            </p>
          </section>

          {/* International Data Transfers */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">International Data Transfers</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your information may be transferred to and maintained on servers located outside of Kenya. By using Ask Nyumbani, you consent
              to the transfer of your information to countries that may have different data protection laws than Kenya. We ensure that
              appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless
              a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or
              anonymize it.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Property Listings:</strong> Active property listings are retained until you remove them. Inactive listings may be archived
              after 12 months of inactivity.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Third-Party Links and Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our app may contain links to third-party websites or services (such as Google Maps) that are not operated by us. We have no
              control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
              We encourage you to review the privacy policies of any third-party sites you visit.
            </p>
          </section>

          {/* GDPR Compliance */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">GDPR and International Privacy Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              If you are located in the European Economic Area (EEA) or other regions with data protection laws, you have additional rights under GDPR:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Right to be informed about data collection and use</li>
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Rights related to automated decision-making and profiling</li>
            </ul>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update our Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory
              reasons. We will notify you of any material changes by:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-3">
              <li>Posting the new Privacy Policy in the app</li>
              <li>Updating the "Last Updated" date at the top of this policy</li>
              <li>Sending you a notification through the app or via email</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              We encourage you to review this Privacy Policy periodically. Your continued use of the app after any changes indicates your
              acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-primary/5 rounded-lg p-6 border border-primary/20">
            <h2 className="text-3xl font-bold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>

            <div className="space-y-3 text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">Codzure Solutions Limited</p>
                <p className="text-sm">AskNyumbani Real Estate Platform</p>
              </div>

              <div>
                <p className="font-medium">Email:</p>
                <a href="mailto:support@codzuresolutions.com" className="text-primary hover:underline">codzuregroup@gmail.com</a>
              </div>

              <div>
                <p className="font-medium">Privacy Officer Email:</p>
                <a href="mailto:privacy@codzuresolutions.com" className="text-primary hover:underline">codzuregroup@gmail.com</a>
              </div>

              <div>
                <p className="font-medium">Location:</p>
                <p>Nairobi, Kenya</p>
              </div>

              <div>
                <p className="font-medium">Response Time:</p>
                <p>We aim to respond to all privacy-related inquiries within 30 days.</p>
              </div>
            </div>
          </section>

          {/* Consent */}
          <section className="border-t-2 border-primary/20 pt-6">
            <h2 className="text-2xl font-bold text-foreground mb-3">Your Consent</h2>
            <p className="text-muted-foreground leading-relaxed">
              By using Ask Nyumbani, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
              If you do not agree with this policy, please discontinue use of our services immediately.
            </p>
          </section>

        </div>

        {/* Navigation Links */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
          <Link
            href="/login"
            className="text-primary hover:underline font-medium flex items-center gap-2"
          >
            ← Back to Login
          </Link>
          <span className="hidden sm:inline text-muted-foreground">•</span>
          <Link
            href="/terms"
            className="text-primary hover:underline font-medium"
          >
            Terms of Service
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-muted-foreground space-y-2 pb-8">
          <p>© 2025 Codzure Solutions Limited. All rights reserved.</p>
          <p>Ask Nyumbani Real Estate Platform</p>
        </div>
      </div>
    </div>
  )
}
