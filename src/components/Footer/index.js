import React, { Component } from 'react';
import { Navbar,} from 'react-bootstrap';
import { FaLinkedin, FaGithub, FaPhone, FaWhatsapp } from 'react-icons/fa';
import { MdEmail } from "react-icons/md";

class Footer extends Component {
  render() {
    return (
      
      <Navbar bg="primary" variant="dark" className="fixed-bottom">
        <Navbar.Brand >Fernando Reis Developer</Navbar.Brand>
        <a class="navbar-brand" href="https://www.linkedin.com/in/fernando-reis-79b643144/">
       <FaLinkedin size='2rem'/>
       </a>

       <a class="navbar-brand" href="https://github.com/fernandoreis9173">
       <FaGithub size='2rem'/>
       </a>

       <FaPhone class="navbar-brand" size='2rem'/>
       <Navbar.Brand >(92) 99461-4367</Navbar.Brand>

       <FaWhatsapp class="navbar-brand" size='2rem' />
       <Navbar.Brand >(92) 99984-5104</Navbar.Brand>

       <MdEmail class="navbar-brand" size='2rem'/>
       <Navbar.Brand >fernandoreis9173@gmail.com</Navbar.Brand>
       
      </Navbar>

      
      
    );
  }
}

export default Footer;