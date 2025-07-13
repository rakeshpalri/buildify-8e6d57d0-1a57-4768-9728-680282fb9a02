
import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Features from '../components/Features';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-6">Ultra-Advanced Personal Finance Arbitrage Calculator</h1>
        <p className="text-xl mb-8">Compare the best use of your monthly cash flow between repaying loans and investing in SIPs.</p>
        <Link to="/calculator">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Launch Calculator
          </Button>
        </Link>
      </div>
      <Features />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
