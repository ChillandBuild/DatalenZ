import Link from 'next/link'
import { ArrowRight, BarChart2, Code2, Database, Lock, Terminal, Cpu, Share2, Zap } from 'lucide-react'
import { MathBackground } from '@/components/math-background'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <MathBackground />

      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-serif font-bold rounded-sm">
              ∫
            </div>
            <span className="font-semibold text-lg tracking-tight">DataLen<span className="font-serif">ℤ</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Sign In
            </Link>
            <Link
              href="/auth?mode=signup"
              className="text-sm font-medium bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600 mb-4">
            <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
            v1.0 Now Available
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black">
            Data analysis, <br />
            <span className="text-gray-400 font-serif italic">transparently</span> solved.
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Stop trusting black boxes. DataLen<span className="font-serif">ℤ</span> generates visible, executable Python code
            to analyze your data. Pure mathematics, zero magic.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/auth"
              className="group flex items-center gap-2 bg-black text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-gray-800 transition-all hover:px-10"
            >
              Start Analyzing
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="https://github.com/datalens"
              className="flex items-center gap-2 px-8 py-4 rounded-md text-lg font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
            >
              View on GitHub
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-32 w-full">
          {[
            {
              icon: Code2,
              title: "Transparent Code",
              desc: "Every analysis generates visible, editable Python code. No hidden logic."
            },
            {
              icon: Lock,
              title: "Secure Sandboxes",
              desc: "Code runs in isolated E2B environments. Your data never leaves the secure perimeter."
            },
            {
              icon: BarChart2,
              title: "Dynamic Visuals",
              desc: "Interactive Plotly charts that respond to your data in real-time."
            }
          ].map((feature, i) => (
            <div key={i} className="group p-8 rounded-xl border border-gray-100 bg-white hover:border-black/10 hover:shadow-lg transition-all duration-300 text-left">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* How it Works Section */}
        <div className="w-full max-w-6xl mx-auto mt-32 text-left">
          <h2 className="text-3xl font-bold mb-16 text-center">How it Works</h2>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: "Upload Data",
                  desc: "Drag and drop your CSV or Excel files. We automatically detect the schema and types."
                },
                {
                  step: "02",
                  title: "Ask Questions",
                  desc: "Type in plain English. 'Show me sales by region' or 'Calculate the correlation between price and demand'."
                },
                {
                  step: "03",
                  title: "Verify Code",
                  desc: "Watch as we generate Python code. You can read it, edit it, or just run it."
                },
                {
                  step: "04",
                  title: "Get Results",
                  desc: "See interactive charts and tables. Export your findings instantly."
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="text-4xl font-serif font-bold text-gray-200">{item.step}</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 h-full min-h-[500px] relative overflow-hidden flex items-center justify-center">
              {/* Abstract Representation of the Process */}
              <div className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />
              <div className="relative z-10 space-y-4 w-full max-w-sm">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 animate-pulse">
                  <div className="h-4 w-3/4 bg-gray-100 rounded mb-2" />
                  <div className="h-4 w-1/2 bg-gray-100 rounded" />
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="text-gray-300 rotate-90" />
                </div>
                <div className="bg-black text-white p-4 rounded-lg shadow-lg">
                  <div className="font-mono text-xs opacity-70 mb-2">Generating Python...</div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-gray-700 rounded" />
                    <div className="h-2 w-5/6 bg-gray-700 rounded" />
                    <div className="h-2 w-4/6 bg-gray-700 rounded" />
                  </div>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="text-gray-300 rotate-90" />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-end gap-2 h-24 justify-between px-4 pb-2">
                    {[40, 70, 50, 80, 60].map((h, i) => (
                      <div key={i} className="w-8 bg-black rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Deep Dive */}
        <div className="w-full bg-black text-white mt-32 py-24 -mx-6 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Built for Engineers,<br />Designed for Everyone</h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  We don't hide the complexity; we manage it. DataLens is built on a robust stack of open-source technologies that data scientists love.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: Terminal, label: "Python 3.11 Runtime" },
                    { icon: Database, label: "Pandas & NumPy" },
                    { icon: Cpu, label: "E2B Sandboxing" },
                    { icon: Zap, label: "FastAPI Backend" }
                  ].map((tech, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-300">
                      <tech.icon className="w-5 h-5" />
                      <span>{tech.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-900 rounded-xl p-6 font-mono text-sm text-gray-300 border border-gray-800 shadow-2xl">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="space-y-1">
                  <p><span className="text-purple-400">import</span> pandas <span className="text-purple-400">as</span> pd</p>
                  <p><span className="text-purple-400">import</span> plotly.express <span className="text-purple-400">as</span> px</p>
                  <p className="text-gray-500"># Load and process data</p>
                  <p>df = pd.read_csv(<span className="text-green-400">'data.csv'</span>)</p>
                  <p>df[<span className="text-green-400">'total'</span>] = df[<span className="text-green-400">'price'</span>] * df[<span className="text-green-400">'quantity'</span>]</p>
                  <p>&nbsp;</p>
                  <p className="text-gray-500"># Generate visualization</p>
                  <p>fig = px.bar(df, x=<span className="text-green-400">'category'</span>, y=<span className="text-green-400">'total'</span>)</p>
                  <p>fig.show()</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 mb-24 text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to analyze?</h2>
          <p className="text-xl text-gray-500">Join thousands of data analysts working smarter.</p>
          <Link
            href="/auth?mode=signup"
            className="inline-block bg-black text-white px-10 py-5 rounded-md text-xl font-medium hover:bg-gray-800 transition-all hover:scale-105"
          >
            Get Started for Free
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 bg-white relative z-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black text-white flex items-center justify-center font-serif font-bold rounded-sm text-xs">
              ∫
            </div>
            <span className="font-semibold text-sm">DataLen<span className="font-serif">ℤ</span></span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <Link href="#" className="hover:text-black">Privacy</Link>
            <Link href="#" className="hover:text-black">Terms</Link>
            <Link href="#" className="hover:text-black">Twitter</Link>
            <Link href="#" className="hover:text-black">GitHub</Link>
          </div>
          <div className="text-sm text-gray-400">
            © 2024 DataLenz. Open Source.
          </div>
        </div>
      </footer>
    </div>
  )
}
