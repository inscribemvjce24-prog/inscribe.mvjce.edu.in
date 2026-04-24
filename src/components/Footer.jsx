import { Link } from 'react-router-dom'
import { Github, Instagram, Linkedin } from './icons/socialIcons'
import { scrollToSection } from '../utils/scrollToSection'
import { useTheme } from '../contexts/ThemeContext'

const Footer = () => {
  const { theme } = useTheme()

  const handleNavClick = (sectionId) => {
    if (window.location.pathname !== '/') {
      window.location.href = '/'
      setTimeout(() => {
        scrollToSection(sectionId)
      }, 500)
    } else {
      scrollToSection(sectionId)
    }
  }

  return (
    <footer
      className={`w-full py-12 px-5 border-t transition-all duration-300 liquid-glass mt-12 ${theme === 'dark'
        ? 'border-green-500/20'
        : 'border-black/10'
        }`}
      style={{
        backgroundColor: theme === 'dark' ? 'rgba(10, 15, 28, 0.4)' : 'rgba(253, 251, 249, 0.4)'
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {/* Left Section - Logo and Info */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/images/inslogo.png"
              alt="Inscribe Logo"
              className="w-16 h-16 rounded-xl object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <div>
              <h3 className={`text-2xl font-bold font-montserrat ${theme === 'dark' ? 'text-green-400' : 'text-heading'
                }`}>
                INSCRIBE
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                MVJ College of Engineering
              </p>
            </div>
          </div>
          <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
            Near ITPB, Channasandra, Bangalore – 560067
          </p>
          <a
            href="mailto:inscribe.mvjce@gmail.com"
            className={`footer-link text-sm font-medium inline-block ${theme === 'dark'
              ? 'text-gray-300'
              : 'text-light-maroon hover:opacity-80'
              }`}
          >
            inscribe.mvjce24@gmail.com
          </a>
        </div>

        {/* Middle Section - Quick Links */}
        <div>
          <h4 className={`text-lg font-bold mb-4 font-montserrat ${theme === 'dark' ? 'text-green-400' : 'text-heading'
            }`}>
            Quick Links
          </h4>
          <ul className="space-y-2">
            <li>
              <Link
                to="/team"
                className={`footer-link text-sm no-underline inline-block font-semibold ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-gray-100'
                    : 'text-amber-900 hover:text-amber-950'
                }`}
              >
                Our Domains
              </Link>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('leadership')}
                className={`footer-link text-sm cursor-pointer bg-transparent border-none p-0 font-semibold ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-gray-100'
                    : 'text-amber-900 hover:text-amber-950'
                }`}
              >
                Meet Our Team
              </button>
            </li>
            <li>
              <Link
                to="/events"
                className={`footer-link text-sm no-underline inline-block font-semibold ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-gray-100'
                    : 'text-amber-900 hover:text-amber-950'
                }`}
              >
                Events
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className={`footer-link text-sm no-underline inline-block font-semibold ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-gray-100'
                    : 'text-amber-900 hover:text-amber-950'
                }`}
              >
                Registration
              </Link>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('contact')}
                className={`footer-link text-sm cursor-pointer bg-transparent border-none p-0 font-semibold ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-gray-100'
                    : 'text-amber-900 hover:text-amber-950'
                }`}
              >
                Contact Us
              </button>
            </li>
          </ul>
        </div>

        {/* Right Section - Social Media or Additional Info */}
        <div>
          <h4 className={`text-lg font-bold mb-4 font-montserrat ${theme === 'dark' ? 'text-green-400' : 'text-heading'
            }`}>
            Connect With Us
          </h4>
          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/company/inscribe-mvjce"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 glass-social-btn rounded-full flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 hover:-translate-y-1 hover:bg-[#0077B5] hover:text-white text-gray-600 dark:text-gray-400"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="https://github.com/inscribemvjce24-prog"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 glass-social-btn rounded-full flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 hover:-translate-y-1 hover:bg-[#333333] hover:text-white text-gray-600 dark:text-gray-400"
            >
              <Github size={16} />
            </a>
            <a
              href="https://www.instagram.com/inscribe_mvjce"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 glass-social-btn rounded-full flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 hover:-translate-y-1 hover:bg-gradient-to-r hover:from-[#F58529] hover:via-[#E1306C] hover:to-[#833AB4] hover:text-white text-gray-600 dark:text-gray-400"
            >
              <Instagram size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className={`max-w-7xl mx-auto mt-8 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4 ${theme === 'dark' ? 'border-green-500/20' : 'border-black/10'
        }`}>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
          &copy; {new Date().getFullYear()} Inscribe Club. All rights reserved.
        </p>
        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-accent-2'
          }`}>
          "Engineered by Inscribe minds"
        </p>
        <div className="flex gap-6 text-sm">
          <button
            className={`footer-link cursor-pointer bg-transparent border-none p-0 ${theme === 'dark'
              ? 'text-gray-300'
              : 'text-accent-2 hover:text-heading'
              }`}
          >
            Privacy Policy
          </button>
          <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}>•</span>
          <button
            className={`footer-link cursor-pointer bg-transparent border-none p-0 ${theme === 'dark'
              ? 'text-gray-300'
              : 'text-accent-2 hover:text-heading'
              }`}
          >
            Terms of Service
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
