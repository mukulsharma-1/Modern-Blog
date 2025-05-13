import { connect } from "mongoose";

const databaseConnection = async() => {
    try {
        const connection = await connect(process.env.DATABASE_URI); 
        console.log(`Database Connection Successful to '${connection.connection.host}'`)
    } catch (error) {
        console.log(`DataBase Connection Failed: ${error.message}`)
        process.exit(1)
    }
}

export default databaseConnection;