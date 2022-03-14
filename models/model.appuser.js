module.exports = class AppUser {
    constructor(id, name, phone_number, email, password, emergency_contact_number, emergency_contact_name){
        this.id = id;
        this.name = name;
        this.phone_number = phone_number;
        this.email = email;
        this.password = password;
        this.emergency_contact_number = emergency_contact_number;
        this.emergency_contact_name = emergency_contact_name;
        this.user_active = true;
    }

    //for user registration
    static InsertUser(name, phone_number, email, password){
        const text = `
        INSERT INTO app_user (user_name, user_phone_number, user_email, user_password) VALUES ($1, $2, $3, $4)`

        //TODO: remember to hash + salt password
        const values = [name, phone_number, email, password];
        return [text, values];
    }

    //for updating user details
    static UpdateUser(id, name, phone_number, email, emergency_contact_number, emergency_contact_name){
        const text = `
        UPDATE app_user SET 
        user_name = $2,
        user_phone_number = $3,
        user_email = $4,
        user_emergency_contact_number = $5,
        user_emergency_contact_name = $6
        WHERE user_id = $1`

        const values = [id, name, phone_number, email, emergency_contact_number, emergency_contact_name];
        return [text, values];
    }

    //fetch user details
    static GetUser(id){
        const text = `
        SELECT user_name, user_phone_number, user_email, user_emergency_contact_number, user_emergency_contact_name
        FROM app_user WHERE user_id = $1`

        const values = [id];
        return [text, values];
    }

    //updating user password
    static UpdateUserPassword(id, password){
        const text = `
        UPDATE app_user SET 
        user_password = $2
        WHERE user_id = $1`

        //TODO: hash and salt passwords again

        const values = [id, password];
        return [text, values];
    }

    //fetch password to compare against current password for password change
    static GetUserPasswordHashed(id){
        const text = `
        SELECT user_password FROM app_user WHERE id = $1`

        const values = id;
        return [text, values];
    }

}