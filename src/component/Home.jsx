import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

function Home() {
    // localStorage.clear()

    const [data, setdata] = useState([])
    const [balance, setbalance] = useState()
    const [category, setcategory] = useState([])

    const fetchbal = () => {
        const temp = JSON.parse(localStorage.getItem('finance_balance'))
        setbalance(temp)
    }
    
    useEffect(() => {
        const storedFinance = JSON.parse(localStorage.getItem('finance'))
        if (storedFinance == null) {
            localStorage.setItem('finance', JSON.stringify([]))
        }
        getdata()
        fetchbal()
        handleCategory()
    }, [])

    const getdata = () => {
        const temp = JSON.parse(localStorage.getItem('finance'))
        setdata(temp)
    }

    const handleFilter = (e) => {
        const temp = JSON.parse(localStorage.getItem('finance'))
        if (!temp || e === 'allcat') {
            setdata(temp)
            return
        }
        const filtered = temp.filter((val) => val.category === e)
        setdata(filtered)
    }
    const addtrans = (formdata) => {
        const amount = formdata.iamount
        const desc = formdata.desc
        const cate = formdata.category
        const date = formdata.date
        const type = formdata.type

        const temp = JSON.parse(localStorage.getItem('finance'))
        const newdata = {
            iamount: type === 'income' ? amount : (amount * -1),
            desc: desc,
            category: cate,
            date: date,
            type: type
        }

        const updated = [...temp, newdata]
        const newBalance = updated.reduce((total, val) => {
            return total + Number(val.iamount)
        }, 0)

        localStorage.setItem('finance_balance', JSON.stringify(newBalance))

        localStorage.setItem('finance', JSON.stringify(updated))
        getdata()
        fetchbal()
        handleCategory()
    }

    const init = {
        iamount: '',
        desc: '',
        category: '',
        type: 'income',
        date: '',
        balance: 0
    }

    const validate = Yup.object({
        iamount: Yup.string().matches(/^[0-9]+$/, "Must be only digits").required(),
        desc: Yup.string().min(2).required(),
        category: Yup.string().min(2).required(),
        type: Yup.string().required(),
        date: Yup.string().required(),
    })

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: init,
        validationSchema: validate,
        onSubmit: (values, action) => {
            addtrans(values)
            action.resetForm()
        }
    })

    const handleDelete = (index) => {
        const temp = JSON.parse(localStorage.getItem('finance'))
        temp.splice(index, 1)
        const newBalance = temp.reduce((total, val) => {
            return total + Number(val.iamount)
        }, 0)
        localStorage.setItem('finance_balance', JSON.stringify(newBalance))
        localStorage.setItem('finance', JSON.stringify(temp))
        getdata()
        fetchbal()
    }


    const handleCategory = () => {
        const temp = JSON.parse(localStorage.getItem('finance'))
        const categories = temp.map((val) => val.category)
        setcategory(categories)
    }

    return (
        <div>

            <div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Amount</label>
                        <input
                            type="number"
                            name='iamount'
                            value={values.iamount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <div>
                            {(errors.iamount && touched.iamount) && <font color='red'>{errors.iamount}</font>}
                        </div>
                    </div>
                    <div>
                        <label>Description</label>
                        <input
                            type="text"
                            name='desc'
                            value={values.desc}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <div>
                            {(errors.desc && touched.desc) && <font color='red'>{errors.desc}</font>}
                        </div>
                    </div>
                    <div>
                        <label>Category</label>
                        <input
                            type="text"
                            name='category'
                            value={values.category}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <div>
                            {(errors.category && touched.category) && <font color='red'>{errors.category}</font>}
                        </div>
                    </div>
                    <div>
                        <label>Transaction Type:</label>
                        <select
                            name='type'
                            value={values.type}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                        <div>
                            {(errors.type && touched.type) && <font color='red'>{errors.type}</font>}
                        </div>
                    </div>
                    <div>
                        <label>Date:</label>
                        <input
                            type="date"
                            name='date'
                            value={values.date}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <div>
                            {(errors.date && touched.date) && <font color='red'>{errors.date}</font>}
                        </div>
                    </div>
                    <div>
                        <button type='submit'>Add Transaction</button>
                    </div>
                </form>
            </div>

            <div>
                <div>
                    <div>
                        Balance:{balance ? balance : 0}
                    </div>
                    <div>
                        <select
                            name='filter'
                            onChange={(e) => { handleFilter(e.target.value) }}
                        >
                            <option value="allcat">All Categories</option>
                            {category.map((val, i) => (
                                <option key={i} value={val}>{val}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <td>Type</td>
                                <td>Description</td>
                                <td>Category</td>
                                <td>Date</td>
                                <td>Amount</td>
                                <td>Action</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data?.map((val, i) => {
                                    return (
                                        <tr key={i}>
                                            <td style={{ 'textTransform': 'capitalize' }}>{val.type}</td>
                                            <td>{val.desc}</td>
                                            <td>{val.category}</td>
                                            <td>{val.date}</td>
                                            <td>{Math.abs(val.iamount)}</td>
                                            <td><button type="submit" onClick={() => { handleDelete(i) }}>Delete</button></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Home