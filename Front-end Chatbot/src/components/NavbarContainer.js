import React from 'react';
import styled from 'styled-components';

// Styled Navbar Container
const NavbarContainer = styled.div`
  width: 100%;
  height: 80px; /* Total height */
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

// Red Part (80% of height)
const RedStrip = styled.div`
  height: 80%; /* 48px (80% of 60px) */
  background-color: #ff4444; /* Red */
  display: flex;
  align-items: center;
  padding: 0 20px;
`;

// Yellow Part (20% of height)
const YellowStrip = styled.div`
  height: 20%; /* 12px (20% of 60px) */
  background-color: #ffcc00; /* Yellow */
`;

// Navbar Content (e.g., logo, links)
const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: white;
  font-weight: bold;
`;

const Navbar = () => {
  return (
    <NavbarContainer>
      <RedStrip>
        <NavbarContent>
          <div>
            <a href="/" style={{ color: 'white', marginRight: '15px' }}>Home</a>
          </div>
        </NavbarContent>
      </RedStrip>
      <YellowStrip />
    </NavbarContainer>
  );
};

export default Navbar;