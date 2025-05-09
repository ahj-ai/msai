import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, Users, FileText } from "lucide-react"
import Link from "next/link"
import { SectionTitle } from "@/components/SectionTitle"
import { PageLayout } from "@/components/PageLayout";

const contactReasons = [
  {
    title: "General Inquiries",
    description: "New to MathStack AI? Send us a question, comment, or idea.",
    icon: Mail,
    buttonText: "Email Us",
    href: "mailto:info@mathstackai.com",
  },
  {
    title: "Sales",
    description: "Talk to our Sales team for business inquiries.",
    icon: Phone,
    buttonText: "Contact Sales",
    href: "mailto:sales@mathstackai.com",
  },
  {
    title: "Partnerships",
    description: "Let's chat about potential collaborations.",
    icon: Users,
    buttonText: "Reach Out",
    href: "mailto:partnerships@mathstackai.com",
  },
  {
    title: "Media Requests",
    description: "For press and media-related inquiries.",
    icon: FileText,
    buttonText: "Email Us",
    href: "mailto:media@mathstackai.com",
  },
]


export const ContactUs = () => {
  return (
    <PageLayout showNavFooter={true}>
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Get in Touch"
          subtitle="We're here to help. Reach out and let's start a conversation."
        />
        <div className="flex justify-center mb-12">
          <Button
            variant="secondary"
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105"
          >
            Reach Out Now
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {contactReasons.map((reason, index) => (
            <Card
              key={index}
              className="bg-[#2d1b4e]/80 border-none shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1 rounded-2xl"
            >
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center h-full justify-between">
                  <div>
                    <reason.icon className="w-12 h-12 text-pink-400 mb-6" />
                    <h3 className="text-2xl font-semibold mb-3 text-white">{reason.title}</h3>
                    <p className="text-gray-300 mb-6 text-base">{reason.description}</p>
                  </div>
                  <Link href={reason.href} className="w-full">
                    <Button
                      variant="secondary"
                      className="w-full bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 hover:from-pink-500 hover:to-indigo-600 text-white py-5 text-lg rounded-xl transition-all duration-300 hover:shadow-lg font-semibold"
                    >
                      {reason.buttonText}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}


