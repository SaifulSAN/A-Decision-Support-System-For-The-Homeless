// const bcrypt = require('bcrypt');
// const saltRounds = 12;

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
        //hash+salt in controlller?
        //const salt = await bcrypt.genSalt(saltRounds);
        //const hash_pw = await bcrypt.hash(password, salt);

        const values = [name, phone_number, email, password];
        return [text, values];
    }

    static LoginUserPasswordCmp(email){
        const text = `
        SELECT user_id, user_password FROM app_user WHERE user_email = $1`

        const values = [email];
        return [text, values];
    }

    static CheckUserExistEmail(email){
        const text = `
        SELECT EXISTS (SELECT 1 FROM app_user WHERE user_email = $1)`

        const values = [email];
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

    //dummy function remember to delete
    static Give(){
        const text = `
        SELECT user_id, user_name, user_email FROM app_user`

        return [text];
    }

    //fetch user details
    static GetUserDetails(id){
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
        //const salt = await bcrypt.genSalt(saltRounds);
        //const hash_pw = await bcrypt.hash(password, salt);

        const values = [id, password];
        return [text, values];
    }

    //fetch password to compare against current password for password change
    static GetUserPasswordHashed(id){
        const text = `
        SELECT user_password FROM app_user WHERE user_id = $1`

        const values = [id];
        return [text, values];
    }

    static StoreUserRefreshToken(id, token_string){
        const text = `
        INSERT INTO app_user_token (user_id, app_user_refresh_token) VALUES ($1, $2)`

        const values = [id, token_string];
        return [text, values];
    }

    static FindUserRefreshToken(token_string){
        const text = `
        SELECT user_id from app_user_token WHERE app_user_refresh_token = $1`

        const values = [token_string];
        return [text, values];
    }

    static LogoutUser(token_string){
        const text = `
        DELETE FROM app_user_token WHERE app_user_refresh_token = $1`

        const values = [token_string];
        return [text, values];
    }

}