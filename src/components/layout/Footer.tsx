// src/components/layout/Footer.tsx
export default function Footer() {
    return (
      <footer className="bg-gray-100 mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Cancionero Litúrgico. Un proyecto para la comunidad.</p>
        </div>
      </footer>
    );
  }
  