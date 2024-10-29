import React, { useRef, useState, useEffect } from 'react'
import './Todo.css'
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoIosDoneAll } from "react-icons/io";


function Todo() {
    const [Task, setTodo] = useState("")
    const [data, setData] = useState([])
    const [editId, setEditId] = useState(0)
    const [filter, setFilter] = useState("all")

    useEffect(() => {
        const savedData = localStorage.getItem('todoList');
        if (savedData) {
            setData(JSON.parse(savedData));
        }
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            localStorage.setItem('todoList', JSON.stringify(data));
        } else {
            localStorage.removeItem('todoList');
        }
    }, [data]);

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    const addTodo = () => {
        if (editId && !data.some((todo) => todo.list === Task)) {
            const editTodo = data.find((list) => list.id === editId);
            const updatedTodos = data.map((todo) =>
                todo.id === editTodo.id ? { ...todo, list: Task } : todo
            );
            setData(updatedTodos);
            setEditId(0);
            setTodo('');
        } else {
            if (Task.trim() !== '' && !data.some((todo) => todo.list === Task)) {
                setData([...data, { list: Task, id: Date.now(), status: false }]);
            } else if (Task.trim() == '') {
                alert('Task cannot be empty');
                setTodo('');
            } else {
                alert('Task already exists');
                setTodo('');
            }
        }
    };

    const inputRef = useRef(null);
    useEffect(() => {
        inputRef.current.focus();
    }, [])

    const onComplete = (id) => {
        let complete = data.map((list) => {
            if (list.id == id) {
                return ({ ...list, status: !list.status })
            }
            return list
        })
        setData(complete)
    }

    const onDelete = (id) => {
        setData(data.filter((num) => num.id !== id))
    }

    const onEdit = (id) => {
        const editTask = data.find((list) => list.id == id)
        setTodo(editTask.list)
        setEditId(editTask.id)
    }

    const filteredData = data.filter((item) => {
        if (filter === 'complete'){
            return item.status === true;
        }else if (filter === 'incomplete'){
            return item.status === false;
        }
        return true;
    });

    return (
        <div className="container">
            <h2>To-Do Application</h2>
            <form className="form-group" onSubmit={handleSubmit}>
                <input type="text" value={Task} ref={inputRef} placeholder="Enter the Task" className="form-control" onChange={(event) => setTodo(event.target.value)} />
                <button className='button-add' onClick={addTodo} >{editId ? 'Edit' : 'Add'}</button>
            </form>

            <div className="filter-buttons">
                <button onClick={() => setFilter("all")} className={`all ${filter === "all" ? "active" : ""}`}>All</button>
                <button onClick={() => setFilter("complete")} className={`complete ${filter === "complete" ? "active" : ""}`}>Completed</button>
                <button onClick={() => setFilter("incomplete")} className={`incomplete ${filter === "incomplete" ? "active" : ""}`}>Incomplete</button>
            </div>

            <div className="list">
                <ul>
                    {
                        filteredData.map((to) =>
                            <li className='list-items' key={to.id}>
                                <div className='list-item-list' id={to.status ? 'list-item' : ''} >{to.list}</div>
                                <span>
                                    <IoIosDoneAll className='list-item-icons' id='complete' title='Complete' onClick={() => onComplete(to.id)} />
                                    <FaRegEdit className='list-item-icons' id='edit' title='Edit' onClick={() => onEdit(to.id)} />
                                    <MdDelete className='list-item-icons' id='delete' title='Delete' onClick={() => onDelete(to.id)} />
                                </span>
                            </li>
                        )
                    }
                </ul>
            </div>
        </div>
    )
}

export default Todo;