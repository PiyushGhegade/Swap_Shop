import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function SafetyTipsPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#4285F4] to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Safety Tips</h1>
          <p className="text-lg opacity-90">
            Stay safe while buying and selling on campus with these helpful tips.
          </p>
        </div>
      </section>

      {/* Safety Tips Content */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 space-y-8 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold mb-3">1. Meet in Public Spaces</h2>
            <p>
              Always arrange meetups in well-lit, public areas on campus. Avoid secluded places and bring a friend if possible.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">2. Verify Items Before Paying</h2>
            <p>
              Carefully inspect the item before completing the transaction. Ensure it matches the description and is in the agreed-upon condition.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">3. Use Cash or Trusted Payment Methods</h2>
            <p>
              Prefer cash or secure digital payment services. Avoid sharing sensitive financial information with strangers.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">4. Trust Your Instincts</h2>
            <p>
              If something feels off about a buyer, seller, or situation — trust your gut and don’t go through with the deal.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">5. Report Suspicious Activity</h2>
            <p>
              If you encounter a suspicious listing or user, report it immediately through our Help Center so we can investigate.
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
                <h2 className="text-2xl font-bold mb-3">Need Help or See Something Suspicious?</h2>
                <p className="text-gray-500 mb-4">
                  Reach out to our support team or visit our Help Center for guidance.
                </p>
                <div className="flex space-x-3">
                  <Link href="/helpCenter">
                    <Button variant="outline">Help Center</Button>
                  </Link>
                  <Button variant="accent">
                    <i className="ri-flag-line mr-1"></i> Report a User
                  </Button>
                </div>
              </div>
              <div className="md:w-1/3">
                <img
                  //src="https://images.unsplash.com/photo-1598620618167-0c7b820a7f4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  src="https://www.iitp.ac.in/gymkhana/img/portfolio/Hostels/asima_2.jpg"
                  alt="Safety illustration"
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
