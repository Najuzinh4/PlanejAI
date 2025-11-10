import React from 'react';
import styled from 'styled-components';

export default function PrimaryButton({ children, onClick, disabled }) {
  return (
    <StyledWrapper>
      <button onClick={onClick} disabled={disabled}>{children}</button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: relative;
  display: inline-block;
  button {
   appearance: button;
   /* cor lilás solicitada */
   background-color: #9F7AEA; /* lilac/violet */
   border: solid transparent;
   border-radius: 12px;
   border-width: 0 0 3px;
   box-sizing: border-box;
   color: #FFFFFF;
   cursor: pointer;
   display: inline-block;
   font-size: 14px;
   font-weight: 700;
   letter-spacing: .4px;
   line-height: 18px;
   margin: 0;
   outline: none;
   overflow: visible;
   padding: 8px 12px; /* menor que antes */
   text-align: center;
   text-transform: none; /* menos agressivo */
   touch-action: manipulation;
   transform: translateZ(0);
   transition: filter .15s, transform .12s;
   user-select: none;
   -webkit-user-select: none;
   vertical-align: middle;
   white-space: nowrap;
   position: relative;
  }

  button:after {
   background-clip: padding-box;
   background-color: #A78BFA; /* sombra do lilás */
   border: solid transparent;
   border-radius: 12px;
   border-width: 0 0 3px;
   bottom: -3px;
   content: "";
   left: 0;
   position: absolute;
   right: 0;
   top: 0;
   z-index: -1;
  }

  button:focus {
   user-select: auto;
  }

  button:hover:not(:disabled) {
   filter: brightness(1.1);
  }

  button:disabled {
   cursor: auto;
   opacity: 0.6;
  }

  button:active:after {
   border-width: 0 0 0px;
  }

  button:active {
   padding-bottom: 10px;
  }
`;