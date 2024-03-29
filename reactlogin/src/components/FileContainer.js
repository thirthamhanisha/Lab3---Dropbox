import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import {withStyles} from 'material-ui/styles';
import {GridList, GridListTile} from 'material-ui/GridList';
import Login from "./Login";
import Message from "./Message";
import Welcome from "./Welcome";
import SignUp from "./SignUp";
import * as API from '../api/API';
import {Link} from 'react-router-dom';
import axios from 'axios';
//import gridlist from './ImageGridList.css';
//import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import '../stylesheets/Welcome.css';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

const styles = theme => ({
    root: {
        top: 32,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        background: theme.palette.background.paper
    },
    gridList: {
        width: 300,
        height: 300,
    },
    subheader: {
        width: '100%',
    },
    modal: {
        display: 'none', /* Hidden by default */
        position: 'fixed', /* Stay in place */
        /*z-index: 1, /* Sit on top */
        left: 0,
        top: 0,
        width: 100, /* Full width */
        height: 100, /* Full height */
        overflow: 'auto', /* Enable scroll if needed */
        //backgroundcolor: 'rgb(0,0,0)', /* Fallback color */
        //backgroundcolor: 'rgba(0,0,0,0.4)' /* Black w/ opacity */
    }
});

const customStyles = {
    overlay : {
        position          : 'fixed',
        top               : 0,
        left              : 0,
        right             : 0,
        bottom            : 0,
        backgroundColor   : 'rgba(255, 255, 255, 0.75)'
    },
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

class FileContainer extends Component {

    constructor() {
        super();

        this.state = {
            modalIsOpen: false,
            activeItemName: '',
            activeItemId: null,
            emails: ''
        };

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleShare = this.handleShare.bind(this);
        this.handleStar = this.handleStar.bind(this);

    }

    openModal(item) {
        this.setState({
            modalIsOpen: true,
            activeItemName: item,
            activeItemId: item.id,
            emails: '',
            username: this.props.username
        });
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#00f';
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    handleShare = (userdata) => {
        API.doShare(userdata)
            .then((status) => {
                if (status === 201) {
                    this.setState({
                        modalIsOpen: true,
                        message: "Share successful!!",
                        username: userdata.username,
                        activeItemName: userdata.activeItemName
                    });
                    //this.props.history.push("/welcome");
                } else if (status === 401) {
                    this.setState({
                        isLoggedIn: false,
                        message: "Enter valid information. Try again..!!"
                    });
                }
            });
    };


        handleStar = (file2) => {

            var file = new FormData();
            file.append('item', file2);
            file.append('username',this.state.username);
            API.doStar({username: this.props.username, item: file2 })
            .then((status) => {
                if (status === 201) {
                    this.setState({
                        //    modalIsOpen: true,
                        message: "Share successful!!",
                        username: file2.username,
                        //    activeItemName: file.activeItemName
                    });
                //    this.props.history.push("/");
                } else if (status === 401) {
                    this.setState({
                        isLoggedIn: false,
                        message: "Enter valid information. Try again..!!"
                    });
                }
            });


       };


    /*static propTypes = {
        handleShare: PropTypes.func.isRequired
    };*/

    static propTypes = {
        classes: PropTypes.object.isRequired,
        items: PropTypes.array.isRequired,
        handleShare: PropTypes.func.isRequired,
        username: PropTypes.string.isRequired
    };

    /* state = {
         isShowingModal: false,
     }*/
    //clickModal = (folderpa)
    /*handleClick() {
        this.openModal();
        this.setState
    }*/
    //handleClose = () => this.setState({isShowingModal: false})

    componentWillMount(item){
        this.setState({
            modalIsOpen: false,
            activeItemName: '',
            activeItemId: null,
            emails: ''
        })
    }

    render(){
        const classes = this.props;

        let buttonList = this.props.items.map( item => {
            return (<button onClick={() => this.openModal(item)}>{item}</button>)
        });

        var style ={
            top: 32
        }

        return (
            //const classes = this.props;
            <div className="mainContainer mainContainerRoot">




                <GridList cellHeight={35} cols={1}>
                    {this.props.items.map(tile => (
                        <GridListTile key={tile} cols={tile.cols || 1}>
                            <Modal
                                isOpen={this.state.modalIsOpen}
                                onAfterOpen={this.afterOpenModal}
                                onRequestClose={this.closeModal}
                                style={customStyles}
                                //contentLabel="Example Modal"
                                itemId={this.state.activeItemId}
                                itemName={this.state.activeItemName}
                                overlayClassName="mainContainerRoot mainContainer"
                            >

                                <h6 ref={subtitle => this.subtitle = subtitle}>{this.state.activeItemName}</h6>
                                <h6 ref={subtitle => this.subtitle = subtitle}>{this.state.username}</h6>
                                <button onClick={this.closeModal}>close</button>
                                <form>
                                    <input
                                        className="form-control"
                                        type="text"
                                        label="email"
                                        placeholder="Enter comma separated emails"
                                        value={this.state.emails}
                                        onChange={(event) => {
                                            this.setState({
                                                emails: event.target.value
                                            });
                                        }}
                                    />
                                    <button
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={() => this.handleShare(this.state)}>
                                        Share
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={() => this.handleShare(this.state)}>
                                        Star
                                    </button>
                                </form>
                            </Modal>

                            <div className="itemRow">

                                <div className="recents-item__icon">
                                    <span className="file-icon file-icon--sprite file-icon--spectrum">
                                        <span className="file-icon__img">
                                            <svg width="40" height="40" viewBox="0 0 40 40" className="mc-icon-template-content">
                                                <title>
                                                    content-txt-small
                                                </title>
                                                <defs>
                                                    <rect id="mc-content-txt-small-b" x="8" y="5" width="24" height="30" rx="1.5">

                                                    </rect>
                                                    <filter x="-2.1%" y="-1.7%" width="104.2%" height="106.7%" filterUnits="objectBoundingBox" id="mc-content-txt-small-a">
                                                        <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                                                        <feColorMatrix values="0 0 0 0 0.858859196 0 0 0 0 0.871765907 0 0 0 0 0.884672619 0 0 0 1 0" in="shadowOffsetOuter1"></feColorMatrix></filter>
                                                </defs>
                                                <g fill="none" fillRule="evenodd">
                                                    <g><use fillRule="#000" filter="url(#mc-content-txt-small-a)" xlinkHref="#mc-content-txt-small-b"></use>
                                                        <use fill="#F7F9FA" xlinkHref="#mc-content-txt-small-b"></use>
                                                    </g><path d="M13 15.505a.5.5 0 0 1 .498-.505h13.004c.275 0 .498.214.498.505v.99a.5.5 0 0 1-.498.505H13.498a.494.494 0 0 1-.498-.505v-.99zm0 4a.5.5 0 0 1 .498-.505h13.004c.275 0 .498.214.498.505v.99a.5.5 0 0 1-.498.505H13.498a.494.494 0 0 1-.498-.505v-.99zm0 4c0-.279.233-.505.503-.505h5.994c.278 0 .503.214.503.505v.99a.509.509 0 0 1-.503.505h-5.994a.497.497 0 0 1-.503-.505v-.99z" fill="#637282">

                                                </path>
                                                </g>
                                            </svg></span></span>
                                </div>
                                <a href= {'http://localhost:8080/files/download'+this.props.username+'/'+tile} download
                                   style={{color:'#3d464d'}}
                                   >{tile} </a>
                                <button className="star_toggle star_toggle--unstarred new-folder-button" role="button" aria-pressed="false" aria-label="Star" onClick={() => this.handleStar(tile)}>
                                    <svg width="32" height="32" viewBox="0 0 32 32" class="mc-icon-star">
                                        <title>Artboard</title>
                                        <path d="M20.944 23.717L16 20.949l-4.944 2.768 1.104-5.558L8 14.312l5.627-.667L16 8.5l2.373 5.145 5.627.667-4.16 3.847 1.104 5.558zM17.66 17.45l1.799-1.663-2.433-.289L16 13.275l-1.026 2.224-2.433.289 1.799 1.663-.478 2.403L16 18.657l2.138 1.197-.478-2.403z" fill-rule="nonzero" fill="#0070E0"></path>
                                    </svg>
                                </button>

                                <button className="share-button" onClick={() => this.openModal(tile)} style={{float:'right'}}>Share</button>







                            </div>



                        </GridListTile>
                    ))}
                </GridList>


            </div>
        );
    }


}


export default FileContainer;