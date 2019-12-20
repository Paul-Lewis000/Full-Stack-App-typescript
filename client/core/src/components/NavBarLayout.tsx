import React, { RefObject, Fragment } from "react";
import { NavLink, Link } from "react-router-dom";
import connectPropsAndActions from "../shared/connect";
import AppState from "../models/client/AppState";
import UserActionCreator from "../models/client/UserActionCreator";
import { Menu, Sticky, Dropdown, Image, Button, Sidebar, Icon, Dimmer } from "semantic-ui-react";
import User from "../models/User";
import ResponsiveDesktop from "./shared/ResponsiveDesktop";
import ResponsiveMobile from "./shared/ResponsiveMobile";
import { WRAPPER_VIEW_STYLE } from "../shared/styles";
import { FormattedMessage } from "react-intl";
import MenuFab from "./shared/MenuFab";

interface Props {
    containerRef: RefObject<any>;
    state: AppState;
    actions: UserActionCreator;
}
interface States {
    sidebarVisible: boolean;
}

class NavBarLayout extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
        this.state = {
            sidebarVisible: false
        };
    }
    componentDidMount(): void {
        if (!this.props.state.userState.currentUser) {
            this.props.actions.authenticate();
        }
    }

    render(): React.ReactElement<any> {
        return (<Fragment >
            {this.renderForDesktop()}
            {this.renderForMobile()}
            <MenuFab fabActions={this.props.state.fabActions} />
        </Fragment>);
    }

    private renderForDesktop = (): React.ReactElement<any> => {
        return <ResponsiveDesktop>
            <Sticky context={this.props.containerRef}>
                <Menu borderless style={{border: 0, borderRadius: 0}}>
                    {this.renderMenuForDesktop()}
                    {this.renderAccountControl()}
                </Menu>
            </Sticky>
            {this.props.children}
        </ResponsiveDesktop>;
    }

    private renderMenuForDesktop = (): React.ReactElement<any> => {
        return <Fragment>
            <Menu.Item
                as={Link}
                exact="true" to="/">
                <img src="/favicon.png" alt="logo" style={{marginRight: 10}}/>
                <FormattedMessage id="app.name"/>
            </Menu.Item>
            <Menu.Item as={NavLink} to="/about" >
                <FormattedMessage id="page.about"/>
            </Menu.Item>
            {/* Add more nav items here */}
        </Fragment>;
    }

    private renderForMobile = (): React.ReactElement<any> => {
        return <ResponsiveMobile>
            <Sticky context={this.props.containerRef}>
                <Dimmer.Dimmable as={Menu} dimmed={this.state.sidebarVisible}
                    borderless style={{border: 0, borderRadius: 0, zIndex: 999}}>
                    {this.renderDimmer()}
                    <Menu.Item as={Button} onClick={this.showSideBar}>
                        <Icon name="sidebar" style={{marginRight: 10}}/>
                        <FormattedMessage id="app.name"/>
                    </Menu.Item>
                    {this.renderAccountControl()}
                </Dimmer.Dimmable>
            </Sticky>
            {this.renderMenuForMobile()}
            <Sidebar.Pushable raised="true" style={WRAPPER_VIEW_STYLE} >
                <Sidebar.Pusher dimmed={false} style={WRAPPER_VIEW_STYLE}>
                    <Dimmer.Dimmable dimmed={this.state.sidebarVisible} style={WRAPPER_VIEW_STYLE}>
                        {this.renderDimmer()}
                        {this.props.children}
                    </Dimmer.Dimmable>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </ResponsiveMobile>;
    }

    private renderDimmer = (): React.ReactElement<any> => {
        return <Dimmer
            active={this.state.sidebarVisible}
            onClickOutside={this.hideSideBar}
             style={{ opacity: 0.7 }}/>;
    }

    private renderMenuForMobile = (): React.ReactElement<any> => {
        return <Sidebar as={Menu} width="thin" vertical
            animation="overlay" icon="labeled" inverted
            onHide={this.hideSideBar}
            target={this.props.containerRef}
            visible={this.state.sidebarVisible}
            style={{zIndex: 9999}} >
            <Menu.Item as={NavLink} exact to="/" onClick={this.hideSideBar}>
                <Icon name="home" />
                <FormattedMessage id="page.home"/>
            </Menu.Item>
            <Menu.Item as={NavLink} to="/about" onClick={this.hideSideBar}>
                <Icon name="info circle" />
                <FormattedMessage id="page.about"/>
            </Menu.Item>
            {/* Add more nav items here */}
        </Sidebar>;
    }

    private hideSideBar = () => this.setState({ sidebarVisible: false });

    private showSideBar = () => this.setState({ sidebarVisible: true });

    private renderAccountControl = (): React.ReactElement<any> => {
        return this.props.state.userState.currentUser ?
            this.renderAccountTabsLoggedIn() :
            this.renderAccountTabsBeforeLoggedIn();
    }

    private renderAccountTabsLoggedIn = (): React.ReactElement<any> => {
        const user: User | undefined = this.props.state.userState.currentUser;
        if (!user) {
            return <Fragment />;
        }
        const trigger = (
            <span>
                <Image avatar src={user.avatarUrl ? user.avatarUrl : "/images/avatar.png"} />
                {user.name}
            </span>
        );
        return <Menu.Menu position="right">
            <Dropdown trigger={trigger} pointing="top left" className="link item">
                <Dropdown.Menu>
                    <Dropdown.Item as={NavLink} to="/profile">
                        <FormattedMessage id="page.me.profile"/>
                    </Dropdown.Item>
                    <Dropdown.Item as={NavLink} to="/preferences">
                        <FormattedMessage id="page.me.preferences"/>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={this.props.actions.logout}>
                        <FormattedMessage id="page.me.logout"/>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </Menu.Menu>;
    }

    private renderAccountTabsBeforeLoggedIn = (): React.ReactElement<any> => {
        return <Menu.Menu position="right">
            <Menu.Item
                as={NavLink}
                to="/login/" >
                <FormattedMessage id="page.me.login"/>
            </Menu.Item>
            <Menu.Item
                as={NavLink}
                to="/signup/" >
                <FormattedMessage id="page.me.sign_up"/>
            </Menu.Item>
        </Menu.Menu>;
    }
}

export default connectPropsAndActions(NavBarLayout);