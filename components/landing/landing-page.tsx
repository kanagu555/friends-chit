"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IndianRupee,
  Users,
  TrendingUp,
  Shield,
  Clock,
  Calculator,
  CheckCircle,
  Star,
  ArrowRight,
  Target,
  Award,
  Zap,
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <IndianRupee className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              Friends Chit Fund
            </h1>
          </div>
          <Button
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 flex items-center"
          >
            Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
            🎉 Trusted by 1000+ Members
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Smart Chit Fund
            <span className="text-blue-600"> Management</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join India's most trusted digital chit fund platform. Manage your
            savings, participate in monthly draws, and grow your wealth with
            complete transparency and security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 cursor-pointer flex items-center justify-center"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 border-blue-200 hover:bg-blue-50 cursor-pointer flex items-center justify-center"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Friends Chit Fund?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the perfect blend of traditional chit fund benefits
              with modern digital convenience and security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">100% Secure</CardTitle>
                <CardDescription>
                  Bank-grade security with encrypted transactions and secure
                  data storage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    SSL Encrypted Platform
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Secure Payment Gateway
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Data Protection Compliance
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">High Returns</CardTitle>
                <CardDescription>
                  Earn better returns than traditional savings with our
                  structured chit plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Up to 15% Annual Returns
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Flexible Investment Plans
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Guaranteed Payouts
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Community Driven</CardTitle>
                <CardDescription>
                  Join a trusted community of savers and investors across India
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Verified Members Only
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Transparent Operations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    24/7 Support
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, transparent, and efficient. Start your chit fund journey
              in just 3 steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Join a Chit Fund</h3>
              <p className="text-gray-600">
                Choose from our various chit fund plans ranging from ₹50,000 to
                ₹5,00,000. Select the plan that fits your financial goals and
                monthly budget.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Monthly Contributions
              </h3>
              <p className="text-gray-600">
                Make your monthly contributions on time. Participate in monthly
                auctions to win the chit amount when you need it most.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Earn & Grow</h3>
              <p className="text-gray-600">
                Receive your chit amount when you win, or earn profits when
                others win. Complete the cycle and enjoy guaranteed returns on
                your investment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chit Fund Plans Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Chit Fund Plans
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our carefully designed chit fund plans to match your
              savings goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-blue-200 hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Badge className="mb-2 bg-blue-100 text-blue-800">
                  Most Popular
                </Badge>
                <CardTitle className="text-2xl">₹1 Lakh Chit</CardTitle>
                <CardDescription>
                  Perfect for medium-term financial goals
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-4">
                  ₹10,000
                </div>
                <p className="text-gray-600 mb-6">Monthly Contribution</p>
                <ul className="space-y-3 text-sm text-left mb-6">
                  <li className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-500" />
                    Total Amount: ₹1,00,000
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    Duration: 10 Months
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    Max Members: 10
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-green-500" />
                    Expected Returns: 12-15%
                  </li>
                </ul>
                <Button
                  className="w-full cursor-pointer"
                  onClick={onGetStarted}
                >
                  Join This Plan
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Badge className="mb-2 bg-green-100 text-green-800">New</Badge>
                <CardTitle className="text-2xl">₹50K Chit</CardTitle>
                <CardDescription>
                  Ideal for beginners and small savings
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-4">
                  ₹5,000
                </div>
                <p className="text-gray-600 mb-6">Monthly Contribution</p>
                <ul className="space-y-3 text-sm text-left mb-6">
                  <li className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-500" />
                    Total Amount: ₹50,000
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    Duration: 10 Months
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    Max Members: 10
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-green-500" />
                    Expected Returns: 10-12%
                  </li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={onGetStarted}
                >
                  Join This Plan
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Badge className="mb-2 bg-purple-100 text-purple-800">
                  Premium
                </Badge>
                <CardTitle className="text-2xl">₹5 Lakh Chit</CardTitle>
                <CardDescription>
                  For serious investors and large goals
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-4">
                  ₹50,000
                </div>
                <p className="text-gray-600 mb-6">Monthly Contribution</p>
                <ul className="space-y-3 text-sm text-left mb-6">
                  <li className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-500" />
                    Total Amount: ₹5,00,000
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    Duration: 10 Months
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    Max Members: 10
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-green-500" />
                    Expected Returns: 15-18%
                  </li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={onGetStarted}
                >
                  Join This Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Chit Funds Are Better Than Traditional Savings
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Discover the advantages of chit funds over regular savings
              accounts and fixed deposits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Higher Returns</h3>
              <p className="opacity-90">
                Earn 12-18% returns compared to 3-6% in savings accounts
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Access</h3>
              <p className="opacity-90">
                Get lump sum amount when you need it most through auctions
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Support</h3>
              <p className="opacity-90">
                Be part of a trusted community that helps each other grow
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Plans</h3>
              <p className="opacity-90">
                Choose from multiple plans that fit your budget and goals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Members Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied members who have achieved their
              financial goals with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Friends Chit Fund helped me save for my daughter's wedding.
                  The returns were much better than my bank FD, and I got the
                  money exactly when I needed it."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-blue-600">RS</span>
                  </div>
                  <div>
                    <p className="font-semibold">Rajesh Sharma</p>
                    <p className="text-sm text-gray-500">Mumbai, Maharashtra</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "As a small business owner, chit funds have been a
                  game-changer for managing cash flow. The platform is
                  transparent and the community is trustworthy."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-green-600">PS</span>
                  </div>
                  <div>
                    <p className="font-semibold">Priya Singh</p>
                    <p className="text-sm text-gray-500">Delhi, NCR</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "I've been part of 3 chit funds so far and each time the
                  experience has been excellent. Great returns and professional
                  management."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-purple-600">AP</span>
                  </div>
                  <div>
                    <p className="font-semibold">Amit Patel</p>
                    <p className="text-sm text-gray-500">
                      Bangalore, Karnataka
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Financial Journey?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of members who are already growing their wealth with
            Friends Chit Fund. Start with as little as ₹5,000 per month.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3 cursor-pointer"
            >
              Join Now - It's Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3 cursor-pointer"
            >
              Calculate Returns
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <IndianRupee className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">Friends Chit Fund</h3>
              </div>
              <p className="text-gray-400 mb-4">
                India's most trusted digital chit fund platform helping people
                achieve their financial goals through community-driven savings.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Chit Plans
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Calculator
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Success Stories
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 support@friendschit.com</li>
                <li>📞 +91 97867 08373</li>
                <li>📍 Tamil Nadu, India</li>
                <li>🕒 Mon-Sat: 9AM-6PM</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Friends Chit Fund. All rights
              reserved. | Regulated by RBI Guidelines
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
