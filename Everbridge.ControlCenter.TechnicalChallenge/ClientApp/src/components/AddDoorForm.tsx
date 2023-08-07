import React, { useState } from 'react';
import { addDoor } from '../api/doorAPI';
import { DoorModel } from '../models/DoorModel';
import { Form, Button, Row, Col } from 'react-bootstrap';

const AddDoorForm: React.FC<{ onDoorAdded: (door: DoorModel) => void }> = ({ onDoorAdded }) => {
    const initialDoorState: DoorModel = {
        id: '',
        label: '',
        isOpen: false,
        isLocked: false,
    };

    const [door, setDoor] = useState<DoorModel>(initialDoorState);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = event.target;
        setDoor((prevDoor) => ({
            ...prevDoor,
            [name]: name === 'isOpen' || name === 'isLocked' ? value === 'true' : value,
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        addDoor(door)
            .then((newDoor) => {
                onDoorAdded(newDoor);
                setDoor(initialDoorState);
            })
            .catch((error) => console.error('Error adding the door:', error));
    };

    return (
        <div className="mt-4">
            <h2>Add Door</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={4}>
                        <Form.Label>Label</Form.Label>
                    </Col>
                    <Col md={8}>
                        <Form.Group controlId="label">
                            <Form.Control
                                type="text"
                                name="label"
                                value={door.label}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <Form.Label>Is Open</Form.Label>
                    </Col>
                    <Col md={8}>
                        <div>
                        <Form.Group controlId="isOpen">
                            <Form.Check
                                type="radio"
                                name="isOpen"
                                value="true"
                                checked={door.isOpen === true}
                                onChange={handleChange}
                                style={{ textAlign: 'left', marginRight: '8px' }}
                                label="YES"
                            />
                            <Form.Check
                                type="radio"
                                name="isOpen"
                                value="false"
                                checked={door.isOpen === false}
                                onChange={handleChange}
                                style={{ textAlign: 'left', marginRight: '8px' }}
                                label="NO"
                            />
                            </Form.Group>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <Form.Label>Is Locked</Form.Label>
                    </Col>
                    <Col md={8}>
                    <div>
                        <Form.Group controlId="isLocked">
                            <Form.Check
                                type="radio"
                                name="isLocked"
                                value="true"
                                checked={door.isLocked === true}
                                onChange={handleChange}
                                style={{ textAlign: 'left', marginRight: '8px' }}
                                label="YES"
                            />
                            <Form.Check
                                type="radio"
                                name="isLocked"
                                value="false"
                                checked={door.isLocked === false}
                                onChange={handleChange}
                                style={{ textAlign: 'left', marginRight: '8px' }}
                                label="NO"
                            />
                            </Form.Group>
                     </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button variant="primary" type="submit">
                            Add Door
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default AddDoorForm;
