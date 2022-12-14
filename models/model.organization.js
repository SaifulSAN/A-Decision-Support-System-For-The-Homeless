// const bcrypt = require('bcrypt');
// const saltRounds = 12;

module.exports = class Organization {
    constructor(id, name, primary_contact_number, secondary_contact_number, email, password){
        this.id = id;
        this.name = name;
        this.primary_contact_number = primary_contact_number;
        this.secondary_contact_number = secondary_contact_number;
        this.email = email;
        this.password = password;
        this.org_active = true;
        //TODO: add boolean value to determine if organization has been approved or not
    }

    //organization signup
    static InsertOrganization(name, primary_contact_number, secondary_contact_number, email, password){
        const text = `
        INSERT INTO organization(organization_name, organization_primary_contact_number, organization_secondary_contact_number, organization_email, organization_password)
        VALUES ($1, $2, $3, $4, $5)`

        //TODO: remember to hash + salt password
        //const salt = await bcrypt.genSalt(saltRounds);
        //const hash_pw = await bcrypt.hash(password, salt);

        const values = [name, primary_contact_number, secondary_contact_number, email, password];
        return [text, values];
    }

    //TODO: do we allow organizations to update their own details?
    static UpdateOrganization(id, name, primary_contact_number, secondary_contact_number, email){
        const text = `
        UPDATE organization SET 
        organization_name = $2,
        organization_primary_contact_number = $3,
        organization_secondary_contact_number = $4,
        organization_email = $5
        WHERE organization_id = $1`

        const values = [id, name, primary_contact_number, secondary_contact_number, email];
        return [text, values];
    }

    //fetch organization details
    static GetOrganization(id){
        const text = `
        SELECT organization_name, organization_primary_contact_number, organization_secondary_contact_number, organization_email FROM organization
        WHERE organization_id = $1`

        const values = [id];
        return [text, values];
    }

    //updating organization password
    static UpdateOrganizationPassword(id, password){
        const text = `
        UPDATE organization SET 
        organization_password = $2
        WHERE organization_id = $1`

        //TODO: hash and salt passwords again
        //const salt = await bcrypt.genSalt(saltRounds);
        //const hash_pw = await bcrypt.hash(password, salt);

        const values = [id, password];
        return [text, values];
    }

    //fetch password to compare against current password for password change
    static GetOrganizationPasswordHashed(id){
        const text = `
        SELECT organization_password FROM organization WHERE id = $1`

        const values = id;
        return [text, values];
    }

    static CheckOrgExistEmail(email){
        const text = `
        SELECT EXISTS (SELECT 1 FROM organization WHERE organization_email = $1)`

        const values = [email];
        return [text, values];
    }

    static LoginOrgPasswordCmp(email){
        const text = `
        SELECT organization_id, organization_password FROM organization WHERE organization_email = $1`

        const values = [email];
        return [text, values];
    }

    static StoreOrgRefreshToken(id, token_string){
        const text = `
        INSERT INTO org_token (org_id, org_refresh_token) VALUES ($1, $2)`

        const values = [id, token_string];
        return [text, values];
    }

    static FindOrgRefreshToken(token_string){
        const text = `
        SELECT org_id from org_token WHERE org_refresh_token = $1`

        const values = [token_string];
        return [text, values];
    }

    static LogoutOrg(token_string){
        const text = `
        DELETE FROM org_token WHERE org_refresh_token = $1`

        const values = [token_string];
        return [text, values];
    }
}