import React from 'react';
import { Link } from 'react-router-dom'
import Prismic from 'prismic-javascript';
import PrismicReact from 'prismic-reactjs';

import Header from "./Header"

import './Contestants.css';

const apiEndpoint = 'https://miss-r.cdn.prismic.io/api/v2';


export default class Contestants extends React.Component {

  state = {
    uid: null,
    competitions: null,
    open: false,
    hover: false,
    openCarousel: false,
    lastLetter: "A"
  }

  componentWillMount() {
    if (Object.keys(this.props.match.params).length !== 0 && this.props.match.params.constructor === Object) {
        this.setState({open: true, uid: this.props.match.params.uid})
        this.fetchContestant()
    } 
    this.fetchPage(this.props);
  }

  componentDidMount() {
  }

  componentDidUpdate(props) {
    if (this.props.location.pathname === "/contestants/" && this.state.open){
        this.setState({open: false})
    }
  }

  componentWillReceiveProps(props) {
    this.fetchContestant()
  }

  fetchPage(props) {   
    Prismic.api(apiEndpoint).then(api => {
        api.query(
            Prismic.Predicates.at('document.type', 'competition'), { pageSize : 100, page : 1}
        ).then(response => {
            this.setState({competitions: response.results})
        });
    });

    Prismic.api(apiEndpoint).then(api => {
        api.query(
            Prismic.Predicates.at('document.type', 'contestant'), { pageSize : 100, page : 1}
        ).then(response => {
            this.setState({contestants: response.results})
        });
    });
  }

  openComp(uid, id, index, el) {
    if(this.state.open && this.state.uid === uid){
        this.setState({uid: uid, open: false})
    } else {
         this.setState({uid: uid, open: true, id: id})
         this.fetchContestant()
    }
        // this.renderCommpetition(this.state.competitions, this.state.open, this.state.uid)
    }


  renderLetter(letter, data){
    return data.map((contestant, index) =>
        contestant.data.name_english[0].text[0].toUpperCase() === letter.toUpperCase() ? 
            <li key={index}>
                <Link 
                    onClick={(e) => this.openComp(contestant.uid, contestant.id)} 
                    to={"/contestants/" + contestant.uid}>
                    {PrismicReact.RichText.render(contestant.data.name_english)}
                    <span className="mincho">{PrismicReact.RichText.render(contestant.data.name_chinese)}</span>
                </Link>
            </li>
        : null
    )
  }

  renderContestants(contestants){
    var data = [];
    for (var key in contestants) {
        contestants[key].data.name_english.length > 0 ? data.push(contestants[key]) : null
    }

    let letterArray = []

    for (let i = 0; i < 26; i++) {
        letterArray.push((i+10).toString(36))
    }

    return (
        <div className="content">
            {letterArray.map((letter, index) => (
                <div key={index} className="ordered">
                    <div className="letter">{letter.toUpperCase()}</div>
                    {this.renderLetter(letter, data)}
                </div>
            ))}
        </div>
    );
  }

  renderCompetitions(competitions, contestant){
    var data = [];

    for(var count in contestant.data.competitions_list){
        let uid = contestant.data.competitions_list[count].competitions.uid
        for(var count2 in competitions){
            if(competitions[count2].uid === uid){
                data.push(competitions[count2])
            }
        }
    }

    // console.log(data)

    const Competition = data.map((comp, index) =>
      <li key={index} className={comp.uid === this.state.uid || !this.state.open ? "link" : "link"}>   
        <Link onClick={(e) => this.openComp(comp.uid, index, this)} to={"/competitions/" + comp.uid}>
            <span className="mincho">
                <h1>{PrismicReact.RichText.render(comp.data.title_chinese)}</h1>
            </span>
            <span className="denver">
                {PrismicReact.RichText.render(comp.data.title_english)}
            </span>
            <p className="date">{comp.data.date}</p>
        </Link>
      </li>
    );

    if(this.state.competitions){
        return <div>{Competition}</div>
    } else {
        return <p>Loading</p>
    }
  }

  fetchContestant(){
    let that = this
    Prismic.api(apiEndpoint).then(api => {
        api.query(
            Prismic.Predicates.at('my.contestant.uid', this.state.uid)
        ).then(function(response) {
            that.setState({contestant: response.results[0]})
        });
    });
  }

  renderSingle(){
    if(this.state.contestant)  {
        return(
            <div className="single">
                <div className="list">
                    <div className="image-wrapper">
                        <img alt="" src={this.state.contestant.data.photo.url} />
                    </div>
                    <div className="bio">
                        {PrismicReact.RichText.render(this.state.contestant.data.biography_english)}
                        <span className="mincho">{PrismicReact.RichText.render(this.state.contestant.data.biography_chinese)}</span>
                    </div>
                </div>
                <div className="divider">
                    <div className="line"></div>
                </div>
                <div className="view">
                        {this.renderCompetitions(this.state.competitions, this.state.contestant)}
                </div>
            </div>
      )
    } else {
        return <p>Loading</p>
    }
  } 


  render() {
    if (this.state.competitions) {
      return (
        <div className="frame contestants-wrapper">
                {this.state.open && this.state.contestant ? 
                <Header title_english={PrismicReact.RichText.render(this.state.contestant.data.name_english)} title_chinese={PrismicReact.RichText.render(this.state.contestant.data.name_chinese)} navTo={this.state.open ? false : true} context={"contestants"}/>
                :
                <Header title_english={"Contestants"} title_chinese={"描写 "} navTo={this.state.open ? false : true} context={"contestants"}/>
                }
                {this.state.open ? this.renderSingle() : this.renderContestants(this.state.contestants)}
            </div>
      );
    } else {
      return (
        <div className="frame loading">
            <img className="flower animated" alt="flower" src={process.env.PUBLIC_URL + "/images/flower.png"} />
        </div>
    )
    }
  }
}