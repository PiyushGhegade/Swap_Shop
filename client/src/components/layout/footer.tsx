import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">SWAP SHOP</h3>
            <p className="text-gray-500 text-sm">
              The trusted marketplace for IIT Patna students to buy, sell, and share items within their campus community — making college life smarter, greener, and more affordable!
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/?tab=browse" className="text-gray-500 hover:text-primary">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link href="/create-listing" className="text-gray-500 hover:text-primary">
                  Post an Item
                </Link>
              </li>
              <li>
                <Link href="/messages" className="text-gray-500 hover:text-primary">
                  Messages
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link  href="/?category=684c8cdabd75d23b25da69d1" className="text-gray-500 hover:text-primary">
                  Textbooks
                </Link>
              </li>
              <li>
                <Link href="/?category=684c8cdabd75d23b25da69d2" className="text-gray-500 hover:text-primary">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/?category=684c8cdabd75d23b25da69d3" className="text-gray-500 hover:text-primary">
                  Furniture
                </Link>
              </li>
              <li>
                <Link href="/?category=684c8cdabd75d23b25da69d4" className="text-gray-500 hover:text-primary">
                  Clothing
                </Link>
              </li>
              <li>
                <Link href="/?category=685ec419f2d6622f0f884b51" className="text-gray-500 hover:text-primary">
                  Transportation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/helpCenter" className="text-gray-500 hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/safetyTips" className="text-gray-500 hover:text-primary">
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link href="/termsOfService" className="text-gray-500 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacyPolicy" className="text-gray-500 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SWAP SHOP. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/ourdevelopers" className="text-gray-500 hover:text-primary">
              Our Developers Team
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
