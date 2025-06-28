import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HelpCenterPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I post an item for sale?",
      answer:
        "To post an item, click on the 'Post an Item' button on the homepage or Help Center. If you're not signed in, you'll be asked to log in first. Fill out the item details and submit.",
    },
    {
      question: "Is it free to list items?",
      answer: "Yes — listing items on the campus marketplace is completely free for students.",
    },
    {
      question: "How can I contact a seller?",
      answer:
        "Click on the item you're interested in and use the contact options provided to message the seller directly.",
    },
    {
      question: "Can I edit or delete my listing?",
      answer:
        "Yes, go to your profile/dashboard to view your listings. From there you can edit or remove any of your posts.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#4285F4] to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Help Center</h1>
          <p className="text-lg opacity-90">Answers to your common questions and how to get support.</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4 flex items-center justify-between font-medium text-gray-800 hover:bg-gray-50"
                >
                  {faq.question}
                  <span className="text-xl">
                    {openIndex === index ? "-" : "+"}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="p-4 border-t bg-gray-50 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-10 bg-[#F8F9FA]">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h2 className="text-2xl font-bold mb-3">Still need help?</h2>
                <p className="text-gray-500 mb-4">
                  If your question isn’t answered above, feel free to reach out
                  to our support team.
                </p>
                <Button variant="accent">
                  <i className="ri-mail-line mr-1"></i> Contact Support
                </Button>
              </div>
              <div className="md:w-1/3">
                <img
                  //src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  src="https://www.iitp.ac.in/~ai-nlp-ml/img/ainmg.jpg"
                  alt="Support team"
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
