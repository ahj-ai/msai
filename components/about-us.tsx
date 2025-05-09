import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const AboutUs = () => {
  const values = [
    {
      title: "Student-Centered Learning",
      description:
        "We put students at the heart of everything we do, tailoring our platform to meet individual needs and learning styles.",
      icon: "👩‍🎓",
    },
    {
      title: "Innovation in Education",
      description:
        "We're committed to using cutting-edge AI technology to continuously improve and revolutionize math education.",
      icon: "🚀",
    },
    {
      title: "Accessibility for All",
      description:
        "We believe that every student, regardless of background or circumstances, should have access to high-quality math learning resources.",
      icon: "🌍",
    },
    {
      title: "Data-Driven Improvement",
      description:
        "We continuously analyze data to enhance our platform, personalize the learning experience, and drive better outcomes for students.",
      icon: "📊",
    },
    {
      title: "Empowering Educators",
      description:
        "We support teachers with powerful tools and resources to enhance their instruction and make a greater impact in the classroom.",
      icon: "🏫",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        About MathStack AI
      </motion.h1>

      <motion.section
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-purple-300">Our Mission</h2>
        <p className="text-xl text-purple-200 mb-4">Making Math Accessible for Every Student</p>
        <p className="text-lg text-gray-300">
          At MathStack AI, we believe that every student can succeed in math. We're passionate about creating engaging,
          personalized learning experiences that empower students to build confidence, master key concepts, and achieve
          their full potential. We use the power of AI to make learning more effective and enjoyable.
        </p>
      </motion.section>

      <motion.section
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-purple-300">Our Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="bg-gray-800/50 border-purple-500/20 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-semibold text-purple-200">
                    <span className="text-3xl mr-2">{value.icon}</span>
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-purple-300">Ready to Elevate Your Math Skills?</h2>
        <Link href="/signup">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-xl py-6 px-8">
            Start Your Journey with MathStack AI
          </Button>
        </Link>
      </motion.section>
    </div>
  )
}

