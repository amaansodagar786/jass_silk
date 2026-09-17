import React from 'react'
import "./Home.scss";
import HeroTypography from './HeroSection/HeroTypography';
import BrandIntro from './BrandIntro/BrandIntro';
import SignatureHighlight from './SignatureHighlight/SignatureHighlight';
import ProductsShowcase from './ProductsShowcase/ProductsShowcase';
import Craft from './Craft/Craft';
import ExperienceCursor from './ExperienceCursor/ExperienceCursor';

const Home = () => {
  return (
    <>
      <HeroTypography />
      <BrandIntro image="https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
      <SignatureHighlight />
      <ProductsShowcase/>
      <Craft/>
    
      <ExperienceCursor/>
    </>
  )
}

export default Home