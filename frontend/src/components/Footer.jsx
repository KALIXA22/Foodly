import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaArrowUp,
} from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';

const socialLinks = [
  { icon: FaFacebook, color: 'hover:bg-[#1877F2]', label: 'Facebook' },
  { icon: FaInstagram, color: 'hover:bg-[#F56040]', label: 'Instagram' },
  { icon: FaTwitter, color: 'hover:bg-[#1DA1F2]', label: 'Twitter' },
  { icon: FaLinkedin, color: 'hover:bg-[#0A66C2]', label: 'LinkedIn' },
];

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'My Recipes', to: '/myRecipe' },
  { label: 'Favourites', to: '/favouriteRecipe' },
];

const resources = ['Blog', 'FAQ', 'Cooking Tips', 'Nutrition Guide', 'Contact'];

const contact = [
  {
    icon: MdEmail,
    label: 'Email',
    value: 'hello@foodrecipe.com',
    href: 'mailto:hello@foodrecipe.com',
  },
  {
    icon: MdPhone,
    label: 'Phone',
    value: '+1 234 567 890',
    href: 'tel:+1234567890',
  },
  {
    icon: MdLocationOn,
    label: 'Visit us',
    value: '123 Food Street, NY 100001',
  },
];

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#031B1F] via-[#05141F] to-[#080B15] text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-10 h-72 w-72 rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-secondary/20 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-16 text-white/90">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-2xl">
                🍳
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                  FoodRecipe
                </p>
                <p className="text-lg font-semibold">Taste the Difference</p>
              </div>
            </div>
            <p className="text-sm text-white/70">
              Discover delicious recipes, share your culinary creations, and
              connect with food lovers worldwide.
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ icon: Icon, color, label }) => (
                <button
                  key={label}
                  type="button"
                  className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:text-white ${color}`}
                  aria-label={label}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
              Quick Links
            </p>
            <ul className="space-y-3 text-sm text-white/70">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="inline-flex items-center gap-2 transition hover:text-white"
                  >
                    <span className="h-px w-6 bg-white/30" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
              Resources
            </p>
            <ul className="space-y-3 text-sm text-white/70">
              {resources.map((item) => (
                <li key={item} className="transition hover:text-white">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
              Contact
            </p>
            <div className="space-y-5 text-sm text-white/70">
              {contact.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex gap-4">
                  <div className="mt-1 text-primary">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      {label}
                    </p>
                    {href ? (
                      <a href={href} className="transition hover:text-white">
                        {value}
                      </a>
                    ) : (
                      <p>{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} FoodRecipe. Crafted with care for food
            lovers.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms', 'Cookies'].map((item) => (
              <a key={item} href="#" className="hover:text-white">
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-gradient-to-r from-primary/70 to-secondary/70 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:opacity-90"
          >
            <FaArrowUp /> Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;