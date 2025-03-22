import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="px-4 pt-20 pb-16 sm:px-6 sm:pt-32 sm:pb-24 lg:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Move from <span className="text-vercel">Vercel</span> to <span className="text-primary">Cloudflare</span> seamlessly
          </h1>
          <p className="mt-6 text-xl text-foreground-secondary max-w-3xl mx-auto">
            Diverce helps you migrate your Next.js projects from Vercel to Cloudflare with just a few clicks, no manual configuration needed.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard" className="btn-primary py-3 px-8 text-base">
              Get Started
            </Link>
            <a href="https://github.com/yourusername/diverce" target="_blank" rel="noopener noreferrer" className="btn-secondary py-3 px-8 text-base">
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-background-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Simple Migration Process
            </h2>
            <p className="mt-4 text-lg text-foreground-secondary">
              We handle all the complex configuration so you don't have to.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="card hover:shadow-medium">
              <div className="h-12 w-12 rounded-full bg-primary-lighter flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Automated Conversion</h3>
              <p className="text-foreground-secondary">
                Our tool automatically converts your Next.js project to use @opennextjs/cloudflare and sets up all necessary configurations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card hover:shadow-medium">
              <div className="h-12 w-12 rounded-full bg-secondary-lighter flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Zero Code Changes</h3>
              <p className="text-foreground-secondary">
                Move to Cloudflare without modifying your existing code. We handle all the configuration changes for you.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card hover:shadow-medium">
              <div className="h-12 w-12 rounded-full bg-success-lighter flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Secure & Private</h3>
              <p className="text-foreground-secondary">
                Your code stays secure. We only perform the conversion locally and never store your source code on our servers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-foreground-secondary">
              Three simple steps to move your Next.js app from Vercel to Cloudflare
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Step 1 */}
            <div className="relative">
              <div className="card hover:shadow-medium">
                <div className="absolute -top-4 -left-4 h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">Connect Your Vercel Account</h3>
                <p className="text-foreground-secondary">
                  Sign in with your Vercel account to access your projects.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="card hover:shadow-medium">
                <div className="absolute -top-4 -left-4 h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">Select a Project</h3>
                <p className="text-foreground-secondary">
                  Choose the Next.js project you want to migrate to Cloudflare.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="card hover:shadow-medium">
                <div className="absolute -top-4 -left-4 h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">Start Conversion</h3>
                <p className="text-foreground-secondary">
                  Click convert and let us handle the rest. You'll get a fully Cloudflare-compatible project.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/dashboard" className="btn-primary py-3 px-8 text-base">
              Try It Now
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-6">
            Ready to migrate your Next.js projects?
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-10">
            Diverce makes it easy to move from Vercel to Cloudflare without any hassle.
          </p>
          <Link href="/dashboard" className="btn bg-white text-primary hover:bg-background py-3 px-8 text-base shadow-medium hover:shadow-large">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  )
} 