import React from 'react';
import { Link } from 'react-router-dom'
import './Header.css';

export default class Header extends React.Component {
    state = {
        backText_english: "",
        backText_chinese: ""
    }

    addBack = () =>{
        this.props.navTo ? 
        this.setState({backText_english: "Back", backText_chinese: "回"}) :
        this.setState({backText_english: "Close", backText_chinese: "关"})
    }

    removeBack = () =>{
        this.setState({backText_english: "", backText_chinese: ""})
    }

    render (){
        return (    
            <section className="header">
                {this.props.navTo ? 
                    <Link to={"/"} onMouseEnter={(e)=> this.addBack()} onMouseLeave={(e)=> this.removeBack()} className="arrow">
                        <img alt="back" src={process.env.PUBLIC_URL + "/images/arrow.png"} />
                        <h1 className="backtext"><span className="mincho">{this.state.backText_chinese}</span>{this.state.backText_english}</h1>
                        </Link>
                :
                    <Link to={"/" + this.props.context + "/"} onMouseEnter={(e)=> this.addBack()} onMouseLeave={(e)=> this.removeBack()} className="arrow">
                    <img alt="close" src={process.env.PUBLIC_URL + "/images/close.png"} /><h1 className="backtext"><span className="mincho">{this.state.backText_chinese}</span>{this.state.backText_english}</h1></Link>
                }
                <h1><span className="mincho">{this.props.title_chinese}</span>{this.props.title_english}</h1>
                <p></p>
            </section>
        )
    }
}