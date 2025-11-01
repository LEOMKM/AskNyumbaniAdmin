'use client'

import Link from 'next/link'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-primary to-primary/90 text-white shadow-2xl">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-5xl font-bold mb-2 animate-fade-in">Terms of Service</h1>
          <p className="text-lg text-white/90 animate-slide-in">Ask Nyumbani Real Estate Platform</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-8 animate-fade-in">

          {/* Last Updated */}
          <div className="text-sm text-muted-foreground border-l-4 border-primary pl-4">
            <p className="font-semibold">Last Updated: November 1, 2024</p>
            <p className="mt-1">Effective Date: November 1, 2024</p>
          </div>

          {/* Introduction */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to Ask Nyumbani, a real estate platform operated by Codzure Solutions Limited ("Company," "we," "our," or "us").
              These Terms of Service ("Terms") govern your access to and use of the Ask Nyumbani mobile application ("App"), website,
              and related services (collectively, the "Services").
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to
              these Terms, you may not access or use our Services.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              <strong>Important:</strong> These Terms contain a dispute resolution provision that affects your legal rights. Please read
              it carefully.
            </p>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Eligibility</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              To use Ask Nyumbani, you must:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into binding contracts</li>
              <li>Not be prohibited from using our Services under applicable laws</li>
              <li>Provide accurate and complete information when creating an account</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              By using our Services, you represent and warrant that you meet these eligibility requirements.
            </p>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Account Registration and Security</h2>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Creating an Account</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              While you can browse properties without an account, certain features require registration. When you create an account:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>You must provide accurate, current, and complete information</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You are responsible for all activities that occur under your account</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
              <li>We reserve the right to terminate accounts that provide false information</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Account Security</h3>
            <p className="text-muted-foreground leading-relaxed">
              You agree to safeguard your password and not share your account credentials with others. We are not liable for any loss or
              damage arising from your failure to protect your account information.
            </p>
          </section>

          {/* Use of Services */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Use of Services</h2>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Permitted Uses</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You may use Ask Nyumbani to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Browse and search for real estate properties in Kenya</li>
              <li>View property details, images, and locations</li>
              <li>List properties for sale or rent</li>
              <li>Contact property owners or sellers</li>
              <li>Use GPS-based location services to find nearby properties</li>
              <li>Save favorite properties and searches</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Prohibited Uses</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Post false, misleading, or fraudulent property listings</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with or disrupt the Services or servers</li>
              <li>Attempt to gain unauthorized access to any part of the Services</li>
              <li>Use automated systems (bots, scrapers) to access the Services</li>
              <li>Collect or harvest personal information of other users</li>
              <li>Transmit viruses, malware, or harmful code</li>
              <li>Engage in any commercial use without our prior written consent</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Post content that is illegal, offensive, or infringes on others' rights</li>
            </ul>
          </section>

          {/* Property Listings */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Property Listings</h2>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Listing Requirements</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              When listing a property on Ask Nyumbani, you agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Provide accurate and truthful information about the property</li>
              <li>Only list properties you have the legal right to sell or rent</li>
              <li>Upload genuine photos of the property</li>
              <li>Set reasonable and accurate pricing</li>
              <li>Update or remove listings promptly when properties are no longer available</li>
              <li>Comply with all applicable real estate laws and regulations in Kenya</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Listing Review and Removal</h3>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to review, edit, or remove any property listing that violates these Terms or is deemed inappropriate.
              We do not guarantee the accuracy or quality of user-submitted listings and are not responsible for verifying property
              information.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">No Guarantee of Results</h3>
            <p className="text-muted-foreground leading-relaxed">
              Listing a property on Ask Nyumbani does not guarantee that it will be sold or rented. We do not act as a real estate agent
              or broker and are not involved in any transactions between buyers and sellers.
            </p>
          </section>

          {/* User Content */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">User-Generated Content</h2>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Content Ownership</h3>
            <p className="text-muted-foreground leading-relaxed">
              You retain ownership of all content you submit to Ask Nyumbani, including property listings, photos, descriptions, and
              reviews. However, by submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce,
              modify, distribute, and display your content in connection with operating and improving the Services.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Content Standards</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              All user content must:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Be accurate and not misleading</li>
              <li>Not infringe on any third-party rights (copyright, trademark, privacy)</li>
              <li>Not contain illegal, obscene, or offensive material</li>
              <li>Not contain personal information of others without consent</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Content Moderation</h3>
            <p className="text-muted-foreground leading-relaxed">
              We may, but are not obligated to, monitor and review user content. We reserve the right to remove any content that violates
              these Terms or is objectionable, without notice.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Intellectual Property Rights</h2>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Our Intellectual Property</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              The Services, including all content, features, and functionality, are owned by Codzure Solutions Limited and are protected
              by international copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our trademarks, service marks, and logos ("Marks") may not be used without our prior written consent. All other trademarks
              not owned by us that appear on the Services are the property of their respective owners.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Limited License</h3>
            <p className="text-muted-foreground leading-relaxed">
              We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Services for personal,
              non-commercial purposes in accordance with these Terms.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Copyright Infringement</h3>
            <p className="text-muted-foreground leading-relaxed">
              If you believe that content on our Services infringes your copyright, please contact us at{' '}
              <a href="mailto:legal@codzuresolutions.com" className="text-primary hover:underline">legal@codzuresolutions.com</a> with:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-3">
              <li>Description of the copyrighted work</li>
              <li>Location of the infringing content</li>
              <li>Your contact information</li>
              <li>Statement of good faith belief</li>
              <li>Statement of accuracy and authorization</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Third-Party Services and Links</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Our Services may integrate with or contain links to third-party services, including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Google Maps:</strong> For location services and mapping</li>
              <li><strong>Payment Processors:</strong> For transactions (if applicable)</li>
              <li><strong>Social Media:</strong> For sharing and authentication</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              These third-party services are governed by their own terms and privacy policies. We are not responsible for the content,
              practices, or services provided by third parties.
            </p>
          </section>

          {/* Payments and Fees */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Payments and Fees</h2>
            <p className="text-muted-foreground leading-relaxed">
              Currently, Ask Nyumbani is free to use. We reserve the right to introduce fees for certain features or premium services
              in the future. If we do so, we will provide advance notice and update these Terms accordingly.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Any transactions between users (property purchases, rentals) are solely between those parties. We are not a party to such
              transactions and assume no responsibility for payments, contracts, or disputes arising from them.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Disclaimers and Limitation of Liability</h2>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Service "As Is"</h3>
            <p className="text-muted-foreground leading-relaxed">
              THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING
              BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">No Warranty</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We do not warrant that:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>The Services will be uninterrupted, error-free, or secure</li>
              <li>Property listings are accurate, complete, or current</li>
              <li>Any defects will be corrected</li>
              <li>The Services will meet your specific requirements</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Limitation of Liability</h3>
            <p className="text-muted-foreground leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, CODZURE SOLUTIONS LIMITED SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS
              OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-3">
              <li>Your use or inability to use the Services</li>
              <li>Any unauthorized access to or use of our servers and/or personal information</li>
              <li>Any interruption or cessation of transmission to or from the Services</li>
              <li>Any bugs, viruses, or harmful code transmitted through the Services</li>
              <li>Any errors or omissions in any content or for any loss or damage incurred from use of content</li>
              <li>User content or conduct of third parties on the Services</li>
            </ul>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify, defend, and hold harmless Codzure Solutions Limited, its officers, directors, employees, agents,
              and affiliates from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees,
              arising out of or in any way connected with:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-3">
              <li>Your access to or use of the Services</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights, including intellectual property or privacy rights</li>
              <li>Any content you submit or transmit through the Services</li>
              <li>Your property listings or transactions</li>
            </ul>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Dispute Resolution</h2>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Governing Law</h3>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the Republic of Kenya, without regard to its
              conflict of law provisions.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Dispute Resolution Process</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              In the event of any dispute arising from these Terms or your use of the Services:
            </p>
            <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Informal Resolution:</strong> Contact us first at legal@codzuresolutions.com to attempt informal resolution</li>
              <li><strong>Mediation:</strong> If informal resolution fails, parties agree to mediation in Nairobi, Kenya</li>
              <li><strong>Arbitration:</strong> If mediation is unsuccessful, disputes shall be resolved through binding arbitration in Nairobi</li>
            </ol>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Jurisdiction</h3>
            <p className="text-muted-foreground leading-relaxed">
              You agree that the courts of Nairobi, Kenya shall have exclusive jurisdiction over any disputes that cannot be resolved
              through arbitration.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Termination</h2>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">By You</h3>
            <p className="text-muted-foreground leading-relaxed">
              You may terminate your account at any time by contacting us at support@codzuresolutions.com or through the app settings.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">By Us</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We may suspend or terminate your account and access to the Services, without notice, for:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Violation of these Terms</li>
              <li>Fraudulent or illegal activities</li>
              <li>Repeated complaints from other users</li>
              <li>Non-payment of fees (if applicable)</li>
              <li>Any reason we deem necessary to protect the Services or other users</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Effect of Termination</h3>
            <p className="text-muted-foreground leading-relaxed">
              Upon termination:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-3">
              <li>Your right to access and use the Services will immediately cease</li>
              <li>Your property listings may be removed</li>
              <li>Provisions regarding ownership, disclaimers, indemnification, and limitations of liability will survive</li>
            </ul>
          </section>

          {/* Service Modifications */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Service Modifications</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify, suspend, or discontinue the Services (or any part thereof) at any time, with or without
              notice. We will not be liable to you or any third party for any modification, suspension, or discontinuance of the Services.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              We may also impose limits on certain features or restrict access to parts of the Services without notice or liability.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Changes to These Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may revise these Terms from time to time. The most current version will always be posted on our website and in the app.
              If a revision is material, we will provide notice (such as through the app or via email) at least 30 days prior to the new
              terms taking effect.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              By continuing to access or use the Services after revisions become effective, you agree to be bound by the updated terms.
              If you do not agree to the new terms, please stop using the Services.
            </p>
          </section>

          {/* General Provisions */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">General Provisions</h2>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Entire Agreement</h3>
            <p className="text-muted-foreground leading-relaxed">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and Codzure Solutions Limited
              regarding the Services and supersede all prior agreements.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Severability</h3>
            <p className="text-muted-foreground leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to
              the minimum extent necessary, and the remaining provisions will remain in full force and effect.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Waiver</h3>
            <p className="text-muted-foreground leading-relaxed">
              No waiver of any term of these Terms shall be deemed a further or continuing waiver of such term or any other term, and our
              failure to assert any right or provision under these Terms shall not constitute a waiver of such right or provision.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Assignment</h3>
            <p className="text-muted-foreground leading-relaxed">
              You may not assign or transfer these Terms or your rights and obligations under them without our prior written consent. We
              may assign these Terms without restriction.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Force Majeure</h3>
            <p className="text-muted-foreground leading-relaxed">
              We shall not be liable for any failure to perform our obligations where such failure results from circumstances beyond our
              reasonable control, including but not limited to acts of God, war, terrorism, riots, natural disasters, or government actions.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-primary/5 rounded-lg p-6 border border-primary/20">
            <h2 className="text-3xl font-bold text-foreground mb-4">Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>

            <div className="space-y-3 text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">Codzure Solutions Limited</p>
                <p className="text-sm">AskNyumbani Real Estate Platform</p>
              </div>

              <div>
                <p className="font-medium">General Inquiries:</p>
                <a href="mailto:support@codzuresolutions.com" className="text-primary hover:underline">support@codzuresolutions.com</a>
              </div>

              <div>
                <p className="font-medium">Legal Department:</p>
                <a href="mailto:legal@codzuresolutions.com" className="text-primary hover:underline">legal@codzuresolutions.com</a>
              </div>

              <div>
                <p className="font-medium">Location:</p>
                <p>Nairobi, Kenya</p>
              </div>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="border-t-2 border-primary/20 pt-6">
            <h2 className="text-2xl font-bold text-foreground mb-3">Acknowledgment</h2>
            <p className="text-muted-foreground leading-relaxed">
              BY USING ASK NYUMBANI, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE AND AGREE TO BE BOUND BY THEM.
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
            href="/privacy"
            className="text-primary hover:underline font-medium"
          >
            Privacy Policy
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-muted-foreground space-y-2 pb-8">
          <p>© 2024 Codzure Solutions Limited. All rights reserved.</p>
          <p>AskNyumbani Real Estate Platform</p>
        </div>
      </div>
    </div>
  )
}
