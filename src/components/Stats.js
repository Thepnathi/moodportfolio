import React from 'react';
import ReactDOM from 'react-dom';
import Graph from './Graph.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'; //can't seem to make this work on the git
import '../stylesheet/stats.css';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Container from 'react-bootstrap/Container';
import Photo from './Photo'
import {apiMoodportfolio} from '../App';

//Need to remember to reset graphOption to -1 when navigating away from component - unless it gets recreated?
export default class Stats extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			graphOption: -1, //what the graph is based on. 1 = all, 2 = emotion, 3 = tag
		}
		
		this.photos = new Array();
		this.handleMenuClick = this.handleMenuClick.bind(this);
		this.handleTagClick = this.handleTagClick.bind(this);
		this.handleEmotionClick = this.handleEmotionClick.bind(this);
	}

	componentDidMount() {
			let authToken = localStorage.getItem("authToken");
			let basedOn = "all";

			fetch(apiMoodportfolio + '/EmotionsQuery', {
					method: "POST",
					mode: "cors",
					cache: "no-cache",
					withCredentials: true,
					credentials: "same-origin",
					headers: {
							"Authorization": authToken,
							"Content-Type": "application/json",
					},
					body: JSON.stringify({ "basedOn": basedOn,
																	"startDate": '18/04/2019',
																	"endDate": '19/04/2019',
							})
			})
			.then((res) => res.json())
			.then(json => {
				const result = json.result
				result.forEach(jsonData => {
					this.photos.push(new Photo(jsonData));
				});
			})
			.catch(err => console.log(err))
	}
	
	handleMenuClick(o){
		this.setState({graphOption: o});
	}
	
	handleTagClick(t){
		this.setState({tag: t});
	}
	
	handleEmotionClick(e){
		this.setState({emotion: e});
	}
	
	render () {
		var j;
		j = <Graph graphOption={this.state.graphOption}/>;
		
		switch (this.state.graphOption){
			case 1:
				//All, straight into graph
				j = <Graph graphOption={this.state.graphOption}/>;
				break;
			case 2:
				//Emotion, select emotion
				if (this.state.emotion){
					j = <Graph graphOption={this.state.graphOption} emotion={this.state.emotion}/>
				} else {
					j = <EmotionMenu onClick={this.handleEmotionClick} />
				}
				break;
			case 3:
				//Tag, select tag
				//NO CODE YET - wait for thep's to be done
				//Change this so that doesn't pass these values too
				j = <Graph graphOption={this.state.graphOption} />;
				//j = <Graph graphOption={this.state.graphOption}/>;
				break;
			default:
				//graph option not chosen yet, menu of graph options
				j = <StatsMenu onClick = {this.handleMenuClick}/>
		}

		const photoTest = this.photos[0]
		
		
		return (
			<div className='text-center'>
				{j}
				
			</div>
		);
	}

}

class StatsMenu extends React.Component {
	
	constructor(props) {
		super(props)
		this.handleClick = this.handleClick.bind(this)
	}
	
	renderButton(n, v){
		return (
			<StatsMenuButton 
			name = {n}
			onClick = {() => this.handleClick(v)}
			/>
		);
	}
	
	handleClick(o){
		this.props.onClick(o);
	}
	
	render () {
		return (
			<div className="stats-menu">
				<b>View graph based on:</b>
				<p/>
				<div className="menu-buttons">
				<ButtonGroup vertical>
					{this.renderButton("Eveything", 1)}
					<p/>
					{this.renderButton("Emotion", 2)}
					<p/>
					{this.renderButton("Tag", 3)}
					</ButtonGroup>
				</div>
			</div>
		);
	}
	
}

function StatsMenuButton(props) {
	return (
		<div className="button-row">
			<Button
			variant = "primary"
			onClick={props.onClick}
			block
			>
			{props.name}
			</Button>
		</div>
	);
}

class EmotionMenu extends React.Component {
	
	constructor(props) {
		super(props)
		this.handleClick = this.handleClick.bind(this)
	}
	
	renderButton(n){
		return (
			<EmotionMenuButton 
			name = {n}
			onClick = {() => this.handleClick(n)}
			/>
		);
	}
	
	handleClick(o){
		this.props.onClick(o);
	}
	
	render () {
		return (
			<div className="emotion-menu">
				<b>View graph based on:</b>
				<p/>
				<div className="menu-buttons">
				<ButtonGroup vertical>
					{this.renderButton("Anger")}

					{this.renderButton("Contempt")}

					{this.renderButton("Disgust")}

					{this.renderButton("Fear")}

					{this.renderButton("Joy")}

					{this.renderButton("Surprise")}

					{this.renderButton("Sadness")}

					{this.renderButton("Neutral")}
					</ButtonGroup>
				</div>
			</div>
		);
	}
	
}

function EmotionMenuButton(props) {
	return (
		
			<Button
			variant = "primary"
			onClick={props.onClick}
			block
			>
			{props.name}
			</Button>
	
	);
}

ReactDOM.render(
  <Stats />,
  document.getElementById('root')
);
