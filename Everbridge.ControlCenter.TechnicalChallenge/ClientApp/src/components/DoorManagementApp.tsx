// src/components/DoorManagementApp.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import DoorList from './DoorList';
import DoorDetails from './DoorDetails';
import { Navbar, Nav } from 'react-bootstrap';

const DoorManagementApp: React.FC = () => {
    return (
        <Router>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand as={Link} to="/">
                    Door Management
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/">
                            Door List
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Switch>
                <Route exact path="/" component={DoorList} />
                <Route exact path="/doors" component={DoorList} />
                <Route path="/doors/:doorId" component={DoorDetails} />
            </Switch>
        </Router>
    );
};

export default DoorManagementApp;
