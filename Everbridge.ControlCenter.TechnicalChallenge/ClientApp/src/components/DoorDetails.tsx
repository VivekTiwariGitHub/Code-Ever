import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { fetchDoor, removeDoor, updateDoor } from '../api/doorAPI';
import { DoorModel } from '../models/DoorModel';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import signalRService from '../api/signalRService';

interface DoorParams {
    doorId: string;
}

const DoorDetails: React.FC = () => {
    const { doorId } = useParams<DoorParams>();
    const history = useHistory();
    const [door, setDoor] = useState<DoorModel | null>(null);

    useEffect(() => {
        fetchDoor(doorId)
            .then((door) => {
                setDoor(door);

                const connection = signalRService.startConnection();

                connection.on('SendDoorStatus', (doorId, isOpen, isLocked) => {
                    if (door && door.id === doorId) {
                        setDoor({ ...door, isOpen, isLocked });
                    }
                });

                connection.start();
            })
            .catch((error) => console.error('Error fetching door details:', error));
    }, [doorId]);

    const handleRemoveDoor = () => {
        removeDoor(doorId)
            .then(() => {
                history.push('/doors');
            })
            .catch((error) => console.error('Error removing the door:', error));
    };

    const handleOpenDoor = () => {
        if (door) {
            const updatedDoor: DoorModel = { ...door, isOpen: true };
            updateDoor(doorId, updatedDoor)
                .then((updatedDoor) => setDoor(updatedDoor))
                .catch((error) => console.error('Error updating the door:', error));
        }
    };

    const handleCloseDoor = () => {
        if (door) {
            const updatedDoor: DoorModel = { ...door, isOpen: false };
            updateDoor(doorId, updatedDoor)
                .then((updatedDoor) => setDoor(updatedDoor))
                .catch((error) => console.error('Error updating the door:', error));
        }
    };

    const handleLockDoor = () => {
        if (door) {
            const updatedDoor: DoorModel = { ...door, isLocked: true };
            updateDoor(doorId, updatedDoor)
                .then((updatedDoor) => setDoor(updatedDoor))
                .catch((error) => console.error('Error updating the door:', error));
        }
    };

    const handleUnlockDoor = () => {
        if (door) {
            const updatedDoor: DoorModel = { ...door, isLocked: false };
            updateDoor(doorId, updatedDoor)
                .then((updatedDoor) => setDoor(updatedDoor))
                .catch((error) => console.error('Error updating the door:', error));
        }
    };

    if (!door) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>{door.label}</Card.Title>
                            <Card.Text>
                                <strong>Is Open:</strong> {door.isOpen ? 'Yes' : 'No'}
                            </Card.Text>
                            <Card.Text>
                                <strong>Is Locked:</strong> {door.isLocked ? 'Yes' : 'No'}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Button variant="danger" onClick={handleRemoveDoor}>
                        Remove Door
                    </Button>
                </Col>
                <Col>
                    <Button variant="primary" onClick={handleOpenDoor} disabled={door.isOpen}>
                        Open Door
                    </Button>
                </Col>
                <Col>
                    <Button variant="primary" onClick={handleCloseDoor} disabled={!door.isOpen}>
                        Close Door
                    </Button>
                </Col>
                <Col>
                    <Button variant="primary" onClick={handleLockDoor} disabled={door.isLocked}>
                        Lock Door
                    </Button>
                </Col>
                <Col>
                    <Button variant="primary" onClick={handleUnlockDoor} disabled={!door.isLocked}>
                        Unlock Door
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default DoorDetails;
