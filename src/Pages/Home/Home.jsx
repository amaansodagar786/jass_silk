import React from 'react'
import "./Home.scss";
import HeroTypography from './HeroSection/HeroTypography';
import BrandIntro from './BrandIntro/BrandIntro';
import SignatureHighlight from './SignatureHighlight/SignatureHighlight';
import ProductsShowcase from './ProductsShowcase/ProductsShowcase';
import Craft from './Craft/Craft';
import ExperienceCursor from './ExperienceCursor/ExperienceCursor';

import about from "../../assets/images/about.png"

const Home = () => {
  return (
    <>
      <HeroTypography />
      <BrandIntro image={about} />
      <SignatureHighlight />
      <ProductsShowcase/>
      <Craft/>
    
      <ExperienceCursor/>
    </>
  )
}

export default Home