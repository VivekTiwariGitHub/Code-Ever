import React, { useEffect, useState } from 'react';
import { fetchDoors, removeDoor } from '../api/doorAPI';
import { DoorModel } from '../models/DoorModel';
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, Comparator } from 'react-bootstrap-table2-filter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUnlock, faDoorOpen, faDoorClosed } from '@fortawesome/free-solid-svg-icons';
import signalRService from '../api/signalRService';
import AddDoorForm from './AddDoorForm';
import { Console } from 'console';


const DoorList: React.FC = () => {
    const [doors, setDoors] = useState<DoorModel[]>([]);

    useEffect(() => {
        fetchDoors()
            .then((doors) => {
                setDoors(doors);

                // Establish the SignalR connection to receive real-time updates
                const connection = signalRService.startConnection();

                connection.on('SendDoorStatus', (doorId, isOpen, isLocked) => {
                    console.log('called');
                    setDoors((prevDoors) =>
                        prevDoors.map((door) =>
                            door.id === doorId ? { ...door, isOpen, isLocked } : door
                        )
                    );
                });

                // Connect to the SignalR hub
                connection.start();
            })
            .catch((error) => console.error('Error fetching doors:', error));
    }, []);

    const handleRemoveDoor = (doorId: string) => {
        removeDoor(doorId)
            .then(() => {
                setDoors(doors.filter((door) => door.id !== doorId));
            })
            .catch((error) => console.error('Error removing the door:', error));
    };

    const handleDoorAdded = (addedDoor: DoorModel) => {
        setDoors([...doors, addedDoor]);
    };

    const columns = [
        {
            dataField: 'label',
            text: 'Label',
            sort: true,
            filter: textFilter({ comparator: Comparator.LIKE }), // Add text filtering
        },
        {
            dataField: 'isOpen',
            text: 'Is Open',
            formatter: (cell: boolean) => (cell ? <FontAwesomeIcon icon={faDoorOpen} /> : <FontAwesomeIcon icon={faDoorClosed} />),
        },
        {
            dataField: 'isLocked',
            text: 'Is Locked',
            formatter: (cell: boolean) => (cell ? <FontAwesomeIcon icon={faLock} /> : <FontAwesomeIcon icon={faUnlock} />),
        },
        {
            dataField: 'id',
            text: 'Actions',
            formatter: (cell: string) => (
                <div>
                    <Link to={`/doors/${cell}`} className="btn btn-info btn-sm mx-1">
                        View
                    </Link>
                    <button
                        onClick={() => handleRemoveDoor(cell)}
                        className="btn btn-danger btn-sm"
                    >
                        Remove
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="container mt-4">
            <AddDoorForm onDoorAdded={handleDoorAdded} />

            <h2 className="mb-3">Door List</h2>
            <BootstrapTable
                keyField="id"
                data={doors}
                columns={columns}
                bootstrap4
                filter={filterFactory()} // Enable filtering
            />
        </div>
    );
};

export default DoorList;
