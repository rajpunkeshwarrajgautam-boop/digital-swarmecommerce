"use client";

import { motion } from "framer-motion";
import { XCircle, CheckCircle2 } from "lucide-react";

const pains = [
  {
    problem: "Spending weeks building the same boilerplate from scratch",
    solution: "Get production-ready source code you can start using in 5 minutes",
  },
  {
    problem: "Paying expensive freelancers for basic UI components",
    solution: "Buy beautiful, well-documented templates once — use them forever",
  },
  {
    problem: "Wasting hours searching for quality, trusted resources",
    solution: "Every product is hand-picked, tested, and ready to ship",
  },
];

export function ProblemSolution() {
  return (
    <section className="py-32 bg-white relative overflow-hidden text-center md:text-left">
      <div className="container mx-auto px-6 relative z-10 w-full max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Stop Re-inventing the Wheel
          </h2>
          <p className="text-gray-500 text-xl font-medium max-w-2xl mx-auto">
            Focus on your business logic, not building boilerplate infrastructure from scratch.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pains.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-gray-50 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 border border-gray-100"
            >
              {/* Problem */}
              <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-red-50 relative mt-4">
                 <div className="absolute -top-4 -right-2 sm:-right-4 bg-red-100 text-red-600 rounded-full p-1.5 shadow-sm">
                    <XCircle className="w-5 h-5" />
                 </div>
                <p className="text-gray-600 font-medium pt-2">{item.problem}</p>
              </div>
              
              {/* Solution */}
              <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-green-50 relative mb-4">
                 <div className="absolute -bottom-4 -right-2 sm:-right-4 bg-green-100 text-green-600 rounded-full p-1.5 shadow-sm">
                    <CheckCircle2 className="w-5 h-5" />
                 </div>
                <p className="text-gray-900 font-bold pb-2">{item.solution}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
