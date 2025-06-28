import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function PrivacyPolicyPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#4285F4] to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-lg opacity-90">
            Understand how we collect, use, and protect your personal information.
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 space-y-8 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold mb-3">1. Information We Collect</h2>
            <p>
              We collect personal information you provide when signing up, posting items, or contacting other users.
              This may include your name, email address, phone number, and any content you post on the platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">2. How We Use Your Information</h2>
            <p>
              We use your information to provide, improve, and personalize our services. This includes facilitating
              transactions, sending notifications, and ensuring a secure experience for all users.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">3. Sharing of Information</h2>
            <p>
              Your information is only shared with other users for the purpose of buying and selling items. We do not
              sell or rent your personal data to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">4. Data Security</h2>
            <p>
              We implement security measures to protect your personal data from unauthorized access, alteration, or
              disclosure. However, no online platform is 100% secure.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">5. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Significant changes will be communicated through our
              platform or via email.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or your data, feel free to reach out to us through our
              Help Center.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 bg-[#F8F9FA]">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h2 className="text-2xl font-bold mb-3">Have Questions?</h2>
                <p className="text-gray-500 mb-4">
                  Check out our Help Center or get in touch with our support team.
                </p>
                <div className="flex space-x-3">
                  <Link href="/helpCenter">
                    <Button variant="outline">Help Center</Button>
                  </Link>
                  <Button variant="accent">
                    <i className="ri-mail-line mr-1"></i> Contact Support
                  </Button>
                </div>
              </div>
              <div className="md:w-1/3">
                <img
                  //src="https://images.unsplash.com/photo-1581090700227-1e37b190418e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  src="https://www.iitp.ac.in/gymkhana/img/portfolio/Hostels/kalam_1.jpg"
                  alt="Privacy illustration"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
