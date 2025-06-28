import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function TermsOfServicePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#4285F4] to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Terms of Service</h1>
          <p className="text-lg opacity-90">
            Please read these terms carefully before using our platform.
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 space-y-8 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using our platform, you agree to be bound by these Terms of Service and our Privacy Policy.
              If you do not agree with any part of these terms, you must not use the platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">2. User Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account and all activities that occur under
              your account. You agree not to use the platform for any unlawful or prohibited purpose.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">3. Listing & Transactions</h2>
            <p>
              Users are solely responsible for the content of their listings and any transactions made through the
              platform. We are not involved in or liable for any transactions between users.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">4. Prohibited Activities</h2>
            <p>
              You may not use the platform to post illegal items, spam, offensive content, or engage in fraudulent
              activities. Violation of these rules may result in suspension or termination of your account.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">5. Limitation of Liability</h2>
            <p>
              We are not liable for any indirect, incidental, or consequential damages arising from your use of the
              platform. All services are provided "as is" without warranty of any kind.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">6. Changes to Terms</h2>
            <p>
              We may update these Terms of Service from time to time. Continued use of the platform after changes
              indicates your acceptance of the new terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">7. Contact Us</h2>
            <p>
              For questions about these terms, please reach out to our support team via the Help Center.
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
                <h2 className="text-2xl font-bold mb-3">Need Help?</h2>
                <p className="text-gray-500 mb-4">
                  Visit our Help Center for FAQs or contact our team for assistance.
                </p>
                <div className="flex space-x-3">
                  <Link href="/help">
                    <Button variant="outline">Help Center</Button>
                  </Link>
                  <Button variant="accent">
                    <i className="ri-mail-line mr-1"></i> Contact Support
                  </Button>
                </div>
              </div>
              <div className="md:w-1/3">
                <img
                  //src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  src="https://pbs.twimg.com/profile_images/860419432455086080/OJXIyJ7P_400x400.jpg"
                  alt="Terms illustration"
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
