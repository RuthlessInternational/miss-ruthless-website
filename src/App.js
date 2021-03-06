import React from 'react';
import { Link } from 'react-router-dom'
import Prismic from 'prismic-javascript';
import PrismicReact from 'prismic-reactjs';

import moment from 'moment'
import Scene from './components/Scene'

import './App.css';
const apiEndpoint = 'https://miss-r.cdn.prismic.io/api/v2';

function Splash(props) {
    return (
        <header className={props.fade ? "splash fade": "splash"}>
            <img className={props.fade ? "splash-image fade": "splash-image"} alt="splash" src={process.env.PUBLIC_URL + "/images/vector2.svg"} />
        </header>
    )
}

function BG(props) {
    return (
        <div className="bg">
            <Scene {...props}/>
        </div>
    )
}

function Upcoming(props) {
    var data = [];
    let i = 0
    var data2 = [];
    for (let key in props.competitions) {
        if (props.competitions[key].data.type === "Upcoming" && i < 1){
          data.push(props.competitions[key]);
          i++
        }
    }

    for (let key in props.contestants) {
        let competitions = props.contestants[key].data.competitions_list
        for (var count in competitions) {
            if(competitions[count].competitions.slug === data[0].uid){
                data2.push(props.contestants[key])
            }
        }
    }

    // const Contestants = data2.map((cont, index) =>
    //     <li className="contestant" key={index}>
    //         <Link to={process.env.PUBLIC_URL + "/contestants/" + cont.uid} id={cont.uid} className="contestant"><span className="mincho">{PrismicReact.RichText.render(cont.data.name_chinese)}</span>{PrismicReact.RichText.render(cont.data.name_english)}</Link>
    //     </li>
    // );


    return (    
        <section className="upcoming">
            <Link to={process.env.PUBLIC_URL +  "/competitions/" + data[0].uid}>
                <div className="upcoming-title">
                    <img className="wreath" alt="wreath" src={process.env.PUBLIC_URL + "/images/wreath-left.png"} />
                    <div>
                        <span className="mincho">{PrismicReact.RichText.render(data[0].data.title_chinese)}</span>
                        <span className="denver">{PrismicReact.RichText.render(data[0].data.title_english)}</span>
                        <p className="date">{moment(data[0].data.date_time).format('YYYY/MM/DD')}{data[0].data.date_time_end ? " - " +  moment(data[0].data.date_time_end).format('YYYY/MM/DD') : null}</p>
                    </div>
                    <img className="wreath" alt="wreath" src={process.env.PUBLIC_URL + "/images/wreath-right.png"} />
                </div>
            </Link>

            <div className="rule"></div>
            <section className="preview">
                    {PrismicReact.RichText.render(data[0].data.preview_text_english)}
                <div className="mincho ">
                    {PrismicReact.RichText.render(data[0].data.preview_text_chinese)}
                </div>
            </section>

            <div className="upcoming-details">
                <span className="left">{PrismicReact.RichText.render(data[0].data.location)}</span>
                <p className="date">{moment(data[0].data.date_time).format('YYYY/MM/DD, h:mm a')}{data[0].data.date_time_end ? " - " +  moment(data[0].data.date_time_end).format('YYYY/MM/DD, h:mm a') : null}</p>
            </div>
            <a href={data[0].data.button_link.url} className="apply"><span className="mincho">{PrismicReact.RichText.render(data[0].data.button_text_chinese)}</span>{PrismicReact.RichText.render(data[0].data.button_text_english)}</a>
            <img className="flower" alt="flower" src={process.env.PUBLIC_URL + "/images/flower.png"} />
        </section>
    )   
}

function Contact(props) {
    return (
        <footer className="footer">
            <form id="contactform" action="https://formsubmit.io/send/d88822a1-1636-4c31-8885-fb1b072f9dbd" method="POST">
                <label>
                    <span className="mincho">訂閱</span> Newsletter
                </label>
                <div className="enter">
                    <input type="email" name="email" />
                    <button type="submit"> OK </button>
                </div>
            </form>
            <img className="flower" alt="flower" src={process.env.PUBLIC_URL + "/images/flower.png"} />
            <div className="social-links">
                <a target="_blank" rel="noopener noreferrer" href="http://instagram.com/ruthless.international">Instagram</a>
                <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/ruthlessfans/?hc_ref=SEARCH&fref=nf">Facebook</a>

                <a target="_blank" rel="noopener noreferrer" href="mailto:miss@ruthless.international">Email</a>
                {/* <a target="_blank" rel="noopener noreferrer" href="https://vimeo.com/missruthless">Vimeo</a> */}
            </div>
        </footer>
    )
}

function About(props) {
    let data = props[0].data
    return (    
        <section className="about">
            <div className="section-header">
                <div className="section-title"><span className="mincho">關於我們</span> About</div>
                <div className="section-link">
                    <Link to={process.env.PUBLIC_URL + "/about"}><span className="mincho">更多</span> Read more</Link>
                    <div className="arrow-right"><img className="arrow-right" alt="more" src={process.env.PUBLIC_URL + "/images/arrowRight.png"} /></div>
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
        }
    }

    const Competition = data.map((comp, index) =>
      <li className="link" key={index}>
        <Link to={process.env.PUBLIC_URL +  "/competitions/" + comp.uid}>
            <span className="mincho">
                {PrismicReact.RichText.render(comp.data.title_chinese)}
            </span>
            <span className="denver">{PrismicReact.RichText.render(comp.data.title_english)}</span>
            <p className="date">{moment(comp.data.date_time).format('YYYY/MM/DD')}{comp.data.date_time_end ? " - " +  moment(comp.data.date_time_end).format('YYYY/MM/DD') : null}</p>
        </Link>
      </li>
    );

    return (    
        <section className="competitions">
            <div className="section-header">
                <div className="section-title"><span className="mincho">競賽</span> Competitions</div>
                <div className="section-link">
                    <Link to={process.env.PUBLIC_URL + "/competitions"} params={{ open: false }}><span className="mincho">顯示全部</span> See All</Link>
                    <div className="arrow-right"><img alt="more" className="arrow-right" src={process.env.PUBLIC_URL + "/images/arrowRight.png"} /></div>
                </div>
            </div>
            <section className="section">
                <div className="competition-list">{Competition}</div>
                <img className="featured" alt="features" src={data[0].data.featured_image.url} />
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
        <Link to={process.env.PUBLIC_URL + "/contestants/" + data.uid} id={data.uid} className="contestant">
          <span className="mincho">{PrismicReact.RichText.render(data.data.name_chinese)}</span>
          {PrismicReact.RichText.render(data.data.name_english)}</Link>
      </li>
    );

    return (    
        <section className="contestants">
            <div className="section-header">
                <div className="section-title"><span className="mincho">佳麗</span> Contestants</div>
                <div className="section-link">
                    <Link to={process.env.PUBLIC_URL + "/contestants"} params={{ open: false }}><span className="mincho">顯示全部</span> See All</Link>
                    <div className="arrow-right"><img className="arrow-right" alt="more" src={process.env.PUBLIC_URL + "/images/arrowRight.png"} /></div>
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
        {/* <a href={data.data.link_to_download.url}> */}
        <Link to={process.env.PUBLIC_URL + "/publications/" + data.uid} id={data.uid}>

            <img alt="publication" src={data.data.image.url} />
            <span className="mincho">{PrismicReact.RichText.render(data.data.title_chinese)} </span>
            {PrismicReact.RichText.render(data.data.title_english)}
        </Link>
        {/* </a> */}
      </li>
    );

    return (    
        <section className="publications">
            <div className="section-header">
                <div className="section-title"><span className="mincho">商店</span> Publications</div>
                <div className="section-link">
                    <Link to={process.env.PUBLIC_URL + "/publications"} params={{ open: false }}><span className="mincho">顯示全部</span> See All</Link>
                    <div className="arrow-right"><img className="arrow-right" alt="more" src={process.env.PUBLIC_URL + "/images/arrowRight.png"} /></div>
                </div>
            </div>
            <div className="publication-list">{Publication}</div>
        </section>
    )
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.fireOnScroll = this.fireOnScroll.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.state = { width: 0, height: 0,
        doc: null,
        about: null,
        competitions: null,
        contestants: null,
        publications: null,
        notFound: false,
        x: 0, y: 0
    };
  }

  componentWillMount() {
    this.fetchPage(this.props);
  }

  fireOnScroll() {
    window.scrollY > window.innerHeight*.75 ? this.setState({fade: true}) : this.setState({fade: false})
    this.forceUpdate()
  }

  componentDidMount() {
    window.addEventListener('scroll', this.fireOnScroll, true);
    window.addEventListener('mousemove', this.onMouseMove, true);
    window.addEventListener('resize', this.updateWindowDimensions);
    this.updateWindowDimensions();

  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.fireOnScroll, true);
    window.removeEventListener('mousemove', this.onMouseMove, true);
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  onMouseMove(e) {
    let width = this.state.width
    let height = this.state.height

    let mouseX = ( e.clientX - (width/2) ) * 4;
    let mouseY = ( e.clientY - (height/2) ) * 4;
    if(this.state.x !== mouseX || this.state.y !== mouseY){
        this.setState({ x: mouseX, y: mouseY });
    }
  }

  fetchPage(props) {
    let that = this
    Prismic.api(apiEndpoint).then(api => {
      api.query(Prismic.Predicates.any('document.type', ["about", "contestant"]), { pageSize : 100, page : 1}).then(function(response) {
          let about = response.results.filter(data => data.type === "about")
          let contestants = response.results.filter(data => data.type === "contestant")
          that.setState({ 
              contestants: contestants,
          });
      });
    })

    Prismic.api(apiEndpoint).then(api => {
        api.query(
            Prismic.Predicates.at('document.type', 'about'), { pageSize : 6, page : 1}
        ).then(response => {
            that.setState({about: response.results})
        });
    });

    Prismic.api(apiEndpoint).then(api => {
        api.query(
            Prismic.Predicates.at('document.type', 'competition'), { pageSize : 6, page : 1, orderings : '[my.competition.date_time desc]'}
        ).then(response => {
            that.setState({competitions: response.results})
        });
    });

    Prismic.api(apiEndpoint).then(api => {
        api.query(
            Prismic.Predicates.at('document.type', 'publication'), { pageSize : 6, page : 1,orderings : '[my.publication.published_on desc]' }
        ).then(response => {
            that.setState({publications: response.results})
        });
    });
  }

  render() {
    if (this.state.competitions && this.state.about ) {
      return (
        <div className="frame main" ref={(frame) => { this.frame = frame }}>
            <Splash fade={this.state.fade}/>
            <Upcoming competitions={this.state.competitions} contestants={this.state.contestants}/>
            <About {...this.state.about}/>
            <Competitions {...this.state.competitions}/>
            <Contestants {...this.state.contestants} width={this.state.width} height={this.state.height}/>
            <Publications {...this.state.publications}/>
            <Contact />
            <BG mouseX={this.state.x} mouseY={this.state.y} width={this.state.width} height={this.state.height}/>
        </div>
      );
    }
    return (
        <div className="frame loading">
            <img className="flower animated" alt="flower" src={process.env.PUBLIC_URL + "/images/flower.png"} />
        </div>
    )
  }
}