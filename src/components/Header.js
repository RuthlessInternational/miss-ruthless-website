import React from 'react';
import { Link } from 'react-router-dom'
import Prismic from 'prismic-javascript';

import './Header.css';

export default function Header(props) {
    return (    
        <section className="header">
            {props.navTo ? 
                <Link to={"/"} className="arrow"><img src="/images/arrow.png" /></Link>
            :
                <Link to={"/" + props.context + "/"} className="arrow"><img src="/images/arrow.png" /></Link>
            }
            <h1><span className="mincho">{props.title_chinese}</span>{props.title_english}</h1>
            <p></p>
        </section>
    )
}