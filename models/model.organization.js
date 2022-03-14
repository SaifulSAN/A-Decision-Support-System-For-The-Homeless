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

        const values = [id, name, primary_contact_number, secondary_contact_number, email, password];
        return [text, values];
    }

    //TODO: do we allow organizations to update their own details?
    static UpdateOrganization(name, primary_contact_number, secondary_contact_number, email){
        const text = `
        UPDATE organization SET 
        organization_name = $2,
        organization_primary_contact_number = $3,
        organization_secondary_contact_number = $4,
        organization_email = $5
        WHERE organization id = $1`

        const values = [name, primary_contact_number, secondary_contact_number, email];
        return [text, values];
    }

    //fetch organization details
    static GetOrganization(id){
        const text = `
        SELECT organization_name, organization_primary_contact_number, organization_secondary_contact_number, organization_email FROM organization
        WHERE id = $1`

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
}