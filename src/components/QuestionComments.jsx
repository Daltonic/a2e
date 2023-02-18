import { FaPenAlt, FaTrashAlt } from 'react-icons/fa'
import Identicon from 'react-identicons'
import { setGlobalState, useGlobalState, truncate } from '../store'
import UpdateComment from './UpdateComment'
import { getComments } from '../services/blockchain.jsx'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import DeleteComment from './DeleteComment'
import Payment from './Payment'

const QuestionComments = () => {
  const [comments] = useGlobalState('comments')
  const [loaded, setLoaded] = useState(false)

  const { id } = useParams()

  useEffect(async () => {
    const questionId = id
    await getComments(questionId).then(async () => {
      setLoaded(true)
    })
  }, [])

  return loaded ? (
    <div className="my-4 border-t-2 border-gray-300 border-t-gray-300">
      {comments.map((comment, index) =>
        !comment.deleted ? <Comment comment={comment} key={index} /> : null,
      )}
    </div>
  ) : null
}
export default QuestionComments

const Comment = ({ comment }) => {
  const handleEdit = (comment) => {
    setGlobalState('comment', comment)
    setGlobalState('updateModal', 'scale-100')
  }

  const handleDelete = (comment) => {
    setGlobalState('comment', comment)
    setGlobalState('deleteCommentModal', 'scale-100')
  }
  const handlePayment = (comment) => {
    setGlobalState('comment', comment)
    setGlobalState('paymentModal', 'scale-100')
  }

  return (
    <div className="">
      <div className=" flex justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="w-5/6 cursor-pointer">{comment.commentText}</h2>
          <FaPenAlt
            className="text-xs text-blue-500 cursor-pointer"
            onClick={() => handleEdit(comment)}
          />
          <FaTrashAlt
            className="text-xs text-red-500 cursor-pointer"
            onClick={() => handleDelete(comment)}
          />
        </div>
        <div
          className="flex justify-center items-center space-x-2 cursor-pointer"
          onClick={() => handlePayment(comment)}
        >
          <Identicon string="randomness" size={20} className="rounded-full" />
          <p>{truncate(comment.owner, 4, 4, 11)}</p>
        </div>
      </div>
      {comment ? <UpdateComment /> : null}
      {comment ? <DeleteComment /> : null}
      {comment ? <Payment /> : null}

      <p className="text-slate-500 text-sm font-lg">16, feb 2022</p>
    </div>
  )
}
/*import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";

//Text Intro
export const textIntro = elem => {
  gsap.from(elem, {
    xPercent: -20,
    opacity: 0,
    stagger: 0.2,
    duration: 2,
    scale: -1,
    ease: "back",
  });
};

//Open menu
export const menuShow = (elem1, elem2) => {
  gsap.from([elem1, elem2], {
    duration: 0.7,
    height: 0,
    transformOrigin: "right top",
    skewY: 2,
    ease: "power4.inOut",
    stagger: {
      amount: 0.2,
    },
  })
}

//Close menu
export const menuHide = (elem1, elem2) => {   
  gsap.to([elem1, elem2], {
    duration: 0.8,
    height: 0,
    ease: "power4.inOut",
    stagger: {
      amount: 0.07,
    },
  })
}

//Stagger links
export const staggerLinks = (elem1, elem2, elem3) => {
  gsap.from([elem1, elem2, elem3], {
    duration: 0.8,
    y: 100,
    delay: 0.1,
    ease: "power4.inOut",
    stagger: {
      amount: 0.3,
    },
  })
}

// Hover on the link
export const hoverLink = e => {
  gsap.to(e.target, {
    duration: 0.4,
    y: 3,
    skewX: 4,
    ease: "power2.inOut"
  });
};

// Hover away from the link
export const hoverExit = e => {
  gsap.to(e.target, {
    duration: 0.4,
    y: -3,
    skewX: 0,
    ease: "power2.inOut"
  });
};
//Skew gallery Images
export const skewGallery = elem1 => {
  //register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  // make the right edge "stick" to the scroll bar. force3D: true improves performance
    gsap.set(elem1, { transformOrigin: "right center", force3D: true });
    let clamp = gsap.utils.clamp(-20, 20) // don't let the skew go beyond 20 degrees. 
    ScrollTrigger.create({
      trigger: elem1,
      onUpdate: (self) => {
        const velocity = clamp(Math.round(self.getVelocity() / 300));
        gsap.to(elem1, {
          skew: 0,
          skewY: velocity,
          ease: "power3",
          duration: 0.8,
          overwrite: true,
        });
      },
    });

    import React, {useEffect, useRef} from 'react'
import { gsap } from "gsap"
import { Link } from "react-router-dom"

import {
  menuShow,
  menuHide,
  staggerLinks,
  textIntro,
  hoverLink,
  hoverExit
} from './Animate'

const Menu = ({ state }) => {
   //create refs for our DOM elements
  
  let menuWrapper = useRef(null)
  let show1 = useRef(null)
  let show2 = useRef(null)
  let info = useRef(null)
  let line1 = useRef(null)
  let line2 = useRef(null)
  let line3 = useRef(null)

  useEffect(() => {
    // If the menu is open and we click the menu button to close it.
    if (state.clicked === false) {
      // If menu is closed and we want to open it.

      menuHide(show2, show1);
      // Set menu to display none
      gsap.to(menuWrapper, { duration: 1, css: { display: "none" } });
    } else if (
      state.clicked === true ||
      (state.clicked === true && state.initial === null)
    ) {
      // Set menu to display block
      gsap.to(menuWrapper, { duration: 0, css: { display: "block" } });
      //Allow menu to have height of 100%
      gsap.to([show1, show2], {
        duration: 0,
        opacity: 1,
        height: "100%"
      });
      menuShow(show1, show2);
      textIntro(info);
      staggerLinks(line1, line2, line3);
    }
  }, [state])
  
  return (
    <div ref={(el) => (menuWrapper = el)} className="hamburger-menu">
      <div
        ref={(el) => (show1 = el)}
        className="menu-secondary-background-color"
      ></div>
      <div ref={(el) => (show2 = el)} className="menu-layer">
        <div className="container">
          <div className="wrapper">
            <div className="menu-links">
              <nav>
                <ul>
                  <li>
                    <Link
                      onMouseEnter={(e) => hoverLink(e)}
                      onMouseOut={(e) => hoverExit(e)}
                      ref={(el) => (line1 = el)}
                      to="/about-us"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      onMouseEnter={(e) => hoverLink(e)}
                      onMouseOut={(e) => hoverExit(e)}
                      ref={(el) => (line2 = el)}
                      to="/gallery"
                    >
                      Gallery
                    </Link>
                  </li>
                  <li>
                    <Link
                      onMouseEnter={(e) => hoverLink(e)}
                      onMouseOut={(e) => hoverLink(e)}
                      ref={(el) => (line3 = el)}
                      to="/contact-us"
                    >
                      Contact us
                    </Link>
                  </li>
                  
                </ul>
              </nav>
              <div ref={(el) => (info = el)} className="info">
                <h3>Our Vision</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa, ipsam nesciunt dolores, 
                  similique minus perspiciatis non repudiandae 
                  dolore nulla eos dicta, libero molestias eaque omnis excepturi! Est corporis earum fuga.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu

import React from 'react'

export const Image = () => {
  return (
    <div>
      <h4>Gallery</h4>
      <img
        width="600"
        height="600"
        src={require('../images/image1.jpg')}
        alt="random1"
        className="skewElem"
      />
      <img
        width="600"
        height="600"
        src={require('../images/image2.jpg')}
        alt="random2"
        className="skewElem"
      />
      <img
        width="600"
        height="600"
        src={require('../images/image3.jpg')}
        alt="random3"
        className="skewElem"
      />
      <img
        width="600"
        height="600"
        src={require('../images/image4.jpg')}
        alt="random4"
        className="skewElem"
      />
      <img
        width="600"
        height="600"
        src={require('../images/image5.jpg')}
        alt="random5"
        className="skewElem"
      />
      <img
        width="600"
        height="600"
        src={require('../images/image6.jpg')}
        alt="random6"
        className="skewElem"
      />
      <img
        width="600"
        height="600"
        src={require('../images/image7.jpg')}
        alt="random7"
        className="skewElem"
      />
      <img
        width="600"
        height="600"
        src={require('../images/image8.jpg')}
        alt="random8"
        className="skewElem"
      />
      <img
        width="600"
        height="600"
        src={require('../images/image9.jpg')}
        alt="random9"
        className="skewElem"
      />
      <img
        width="600"
        height="600"
        src={require('../images/image1.jpg')}
        alt="random0"
        className="skewElem"
      />
    </div>
  );
}


} */
