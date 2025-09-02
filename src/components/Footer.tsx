'use client';

import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Algorithms', href: '#algorithms' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: 'https://github.com/WilliamHoltsdalen/algviz/blob/main/README.md', external: true },
      ],
    },
    {
      title: 'Community',
      links: [
        { name: 'GitHub', href: 'https://github.com/WilliamHoltsdalen/algviz', external: true },
        { name: 'Blog', href: 'https://www.williamholtsdalen.com', external: true },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Contact', href: 'https://www.linkedin.com/in/william-holtsdalen/', external: true },
        { 
          name: 'Bug Reports', 
          href: 'https://github.com/WilliamHoltsdalen/algviz/issues/new?assignees=&labels=bug&template=bug_report.yml&title=%5BBug%5D+&body=**Describe+the+bug**%0A_A+clear+and+concise+description+of+what+the+bug+is._%0A%0A**Steps+to+reproduce**%0A1.+Go+to+...%0A2.+Click+on+...%0A3.+Scroll+down+to+...%0A4.+See+error%0A%0A**Expected+behavior**%0A_What+did+you+expect+to+happen%3F_%0A%0A**Screenshots+or+recording**%0A_If+applicable%2C+add+a+screenshot+or+GIF+to+help+explain+your+problem._%0A%0A**Environment**%0A-+OS%3A+%0A-+Browser%3A+%0A-+App+version%3A+', 
          external: true 
        },
        { 
          name: 'Feature Requests', 
          href: 'https://github.com/WilliamHoltsdalen/algviz/issues/new?assignees=&labels=enhancement&template=feature_request.yml&title=%5BFeature+Request%5D+&body=**Is+your+feature+request+related+to+a+problem%3F+Please+describe.**%0A_A+clear+and+concise+description+of+what+the+problem+is._%0A%0A**Describe+the+solution+you%27d+like**%0A_A+clear+and+concise+description+of+what+you+want+to+happen._%0A%0A**Describe+alternatives+you%27ve+considered**%0A_A+clear+and+concise+description+of+any+alternative+solutions+or+features+you%27ve+considered._%0A%0A**Additional+context**%0A_Add+any+other+context+or+screenshots+about+the+feature+request+here._', 
          external: true 
        },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-gradient-to-b from-transparent to-slate-950/50">
      <div className="container mx-auto px-4 py-16 md:py-20">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-bold text-slate-100 mb-4">AlgViz</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-sm">
                Visualize algorithms with elegant, step-by-step animations. Built for clarity, not flash.
              </p>
              
              {/* Social links */}
              <div className="flex items-center gap-4">
                <Link
                  href="https://github.com/WilliamHoltsdalen/algviz"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                  aria-label="GitHub repository"
                >
                  <Github className="h-4 w-4 text-slate-300" aria-hidden />
                </Link>
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                  aria-label="Launch app"
                >
                  <ExternalLink className="h-4 w-4 text-slate-300" aria-hidden />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Footer sections */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: sectionIndex * 0.1, duration: 0.6 }}
            >
              <h4 className="text-sm font-semibold text-slate-100 mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener"
                        className="text-sm text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
                      >
                        {link.name}
                        <ExternalLink className="h-3 w-3" aria-hidden />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
                        onClick={(e) => {
                          if (link.href.startsWith('#')) {
                            e.preventDefault();
                            const element = document.querySelector(link.href);
                            if (element) {
                              element.scrollIntoView({ 
                                behavior: 'smooth',
                                block: 'start'
                              });
                            }
                          }
                        }}
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom section */}
        <motion.div
          className="mt-12 pt-8 border-t border-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>
                © {currentYear} AlgViz. Made by{' '}
                <a
                  href="https://github.com/WilliamHoltsdalen"
                  target="_blank"
                  rel="noopener"
                  className="hover:underline text-slate-300 hover:text-slate-100 transition-colors"
                >
                  William Holtsdalen
                </a>.
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <Link href="https://github.com/WilliamHoltsdalen/algviz/blob/main/LICENSE" target="_blank" rel="noopener" className="text-slate-400 hover:text-slate-200 transition-colors">
                Licensed under MIT
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
