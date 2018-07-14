import React from 'react';
import { Link } from 'react-router-dom'
import Prismic from 'prismic-javascript';
import PrismicReact from 'prismic-reactjs';

import './App.css';
const apiEndpoint = 'https://miss-r.cdn.prismic.io/api/v2';


function Splash(props) {
    return (
        <header className="splash">
            <img className="splash" src="/images/splash.png" />
        </header>
    )
}

function Upcoming(props) {
    var data = [];
    var data2 = [];
    for (var key in props.competitions) {
        if (key < 1){
          data.push(props.competitions[key]);
        }
    }

    for (var key in props.contestants) {
        let competitions = props.contestants[key].data.competitions_list
        for (var count in competitions) {
            console.log(data[0].uid)
            if(competitions[count].competitions.slug === data[0].uid){
                data2.push(props.contestants[key])
            }
        }
    }

    console.log(data[0].data)

    const Contestants = data2.map((cont, index) =>
        <li className="contestant" key={index}>
            <Link to={"/contestants/" + cont.uid} id={cont.uid} className="contestant"><span className="mincho">{PrismicReact.RichText.render(cont.data.name_chinese)}</span>{PrismicReact.RichText.render(cont.data.name_english)}</Link>
        </li>
    );


    return (    
        <section className="upcoming">
            <div className="upcoming-title">
                <img className="wreath" src="/images/wreath-left.png" />
                <div>
                    <span className="mincho">{PrismicReact.RichText.render(data[0].data.title_chinese)}</span>
                    {PrismicReact.RichText.render(data[0].data.title_english)}
                    <h3 className="date">{data[0].data.date}</h3>
                </div>
                <img className="wreath" src="/images/wreath-right.png" />
            </div>

            <div className="rule"></div>
            <div className="contestants-list">{Contestants}</div>
            <div className="upcoming-details">
                <span className="left">{PrismicReact.RichText.render(data[0].data.location)}</span>
                <h3 className="right">{data[0].data.date}</h3>
            </div>
            <a className="apply"><span className="mincho">提交</span> Apply now</a>
            <img className="flower" src="/images/flower.png" />
        </section>
    )   
}

function Contact(props) {
    return (
        <footer className="footer">
            <form>
                <label>
                    <span className="mincho">注册通讯</span> Sign up for newsletter
                    <input type="email" name="email" />
                </label>
                <input type="submit" value="提交 Submit" />
            </form>
            <img className="flower" src="/images/flower.png" />
            <div className="social-links">
                <a href="http://facebook.com">Instagram</a>
                <a href="http://facebook.com">Facebook</a>

                <a href="http://facebook.com">Email</a>
                <a href="http://facebook.com">Vimeo</a>
            </div>
        </footer>
    )
}

function About(props) {
    let data = props[0].data
    return (    
        <section className="about">
            <div className="section-header">
                <div className="section-title"><span className="mincho">描写</span> About</div>
                <div className="section-link">
                    <Link to="/about"><span className="mincho">提交</span> Read more</Link>
                    <div className="arrow-right"><img className="arrow-right" src="/images/arrowRight.png" /></div>

                </div>
            </div>

            <section className="section">
            <div className="a1">
                {PrismicReact.RichText.render(data.text_english)}
            </div>
            <div className="mincho a2">
                {PrismicReact.RichText.render(data.text_chinese)}
            </div>
            </section>
        </section>
    )
}


function Competitions(props) {
    var data = [];
    for (var key in props) {
        if (key < 3){
            data.push(props[key]);
            // console.log(props[key])
        }
    }

    const Competition = data.map((comp, index) =>
      <li className="link" key={index}>
        <Link onClick={(e) => this.openComp(comp.uid, index, this)} to={"/competitions/" + comp.uid}>
            <span className="mincho">
                {PrismicReact.RichText.render(comp.data.title_chinese)}
            </span>
            {PrismicReact.RichText.render(comp.data.title_english)}
            <p className="date">{comp.data.date}</p>
        </Link>
      </li>
    );

    return (    
        <section className="competitions">
            <div className="section-header">
                <div className="section-title"><span className="mincho">以前的比赛</span> Previous competitions</div>
                <div className="section-link">
                    <Link to="/competitions" params={{ open: false }}><span className="mincho">提交</span> See All</Link>
                    <div className="arrow-right"><img className="arrow-right" src="/images/arrowRight.png" /></div>
                </div>
            </div>
            <section className="section">
                <div className="competition-list">{Competition}</div>
                <img className="featured" src={data[0].data.featured_image.url} />
            </section>
        </section>
    )
}

function Contestants(props) {
    var data = [];
    for (var key in props) {
        if (key < 8){
          data.push(props[key]);
        }
    }

    const Contestant = data.map((data, index) =>
      <li className="contestant" key={index}>
        <Link to={"/contestants/" + data.uid} id={data.uid} className="contestant">
          <span className="mincho">{PrismicReact.RichText.render(data.data.name_chinese)}</span>
          {PrismicReact.RichText.render(data.data.name_english)}</Link>
      </li>
    );

    return (    
        <section className="contestants">
            <div className="section-header">
                <div className="section-title"><span className="mincho">以前的比赛</span> Contestants</div>
                <div className="section-link">
                    <a href="/contestants"><span className="mincho">提交</span> See All</a>
                    <div className="arrow-right"><img className="arrow-right" src="/images/arrowRight.png" /></div>
                </div>
            </div>
            <div className="contestants-list">{Contestant}</div>
        </section>
    )
}

function Publications(props) {
    var data = [];
    for (var key in props) {
        data.push(props[key]);
    }

    const Publication = data.map((data, index) =>
      <li className="publication" key={index}>
        <img src={data.data.image.url} />
        <span className="mincho">{PrismicReact.RichText.render(data.data.title_chinese)} </span>
        {PrismicReact.RichText.render(data.data.title_english)}
      </li>
    );

    return (    
        <section className="publications">
            <div className="section-header">
                <div className="section-title"><span className="mincho">商店</span> Publications</div>
                {/* <div className="section-link">
                    <a href="/publi">提交 See All</a>
                    <div className="arrow-right"><img className="arrow-right" src="/images/arrowRight.png" /></div>
                </div> */}
            </div>
            <div className="publication-list">{Publication}</div>
        </section>
    )
}

export default class App extends React.Component {

  state = {
    doc: null,
    about: null,
    competitions: null,
    contestants: null,
    publications: null,
    notFound: false,
  }

  componentWillMount() {
    this.fetchPage(this.props);
  }

  componentWillReceiveProps(props) {
    this.fetchPage(props);
  }

  fetchPage(props) {
    let that = this
    Prismic.api(apiEndpoint).then(api => {
      api.query(Prismic.Predicates.any('document.type', ["competition", "about", "publication", "contestant"]), { pageSize : 100, page : 1}).then(function(response) {
          let about = response.results.filter(data => data.type === "about")
          let competitions = response.results.filter(data => data.type === "competition")
          let contestants = response.results.filter(data => data.type === "contestant")
          let publications = response.results.filter(data => data.type === "publication")
          that.setState({ 
              about: about,
              competitions: competitions,
              contestants: contestants,
              publications: publications,
          });
      });
    })
  }

  render() {
    if (this.state.competitions) {
      return (
        <div className="frame main">
            <Splash />
            <Upcoming competitions={this.state.competitions} contestants={this.state.contestants}/>
            <About {...this.state.about}/>
            <Competitions {...this.state.competitions}/>
            <Contestants {...this.state.contestants}/>
            <Publications {...this.state.publications}/>
            <Contact />
        </div>
      );
    }
    return (
        <div className="frame loading">
            <h1>Loading</h1>
        </div>
    )
  }
}