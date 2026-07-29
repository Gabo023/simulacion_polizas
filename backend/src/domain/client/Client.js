const CLIENT_STATUSES = Object.freeze({
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
});

export class Client {
    constructor({
        id = null,
        identification,
        firstName,
        lastName,
        email,
        phone,
        address = null,
        hasPendingObligations = false,
        status = CLIENT_STATUSES.ACTIVE,
        createdAt = null,
        updatedAt = null,
    }) {
        this.id = id;
        this.identification = Client.normalizeIdentification(identification);
        this.firstName = Client.normalizeName(firstName, "Los nombres");
        this.lastName = Client.normalizeName(lastName, "Los apellidos");
        this.email = Client.normalizeEmail(email);
        this.phone = Client.normalizePhone(phone);
        this.address = Client.normalizeOptionalText(address);
        this.hasPendingObligations =
            Client.validateBoolean(hasPendingObligations);
        this.status = Client.validateStatus(status);
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static get STATUSES() {
        return CLIENT_STATUSES;
    }

    static normalizeIdentification(value) {
        if (typeof value !== "string") {
            throw new Error("La identificación es obligatoria");
        }

        const identification = value.trim();

        if (!identification) {
            throw new Error("La identificación es obligatoria");
        }

        if (identification.length < 10 || identification.length > 20) {
            throw new Error(
                "La identificación debe tener entre 10 y 20 caracteres"
            );
        }

        if (!/^[a-zA-Z0-9-]+$/.test(identification)) {
            throw new Error(
                "La identificación solo puede contener letras, números y guiones"
            );
        }

        return identification.toUpperCase();
    }

    static normalizeName(value, fieldName) {
        if (typeof value !== "string") {
            throw new Error(`${fieldName} son obligatorios`);
        }

        const normalizedValue = value.trim().replace(/\s+/g, " ");

        if (!normalizedValue) {
            throw new Error(`${fieldName} son obligatorios`);
        }

        if (
            normalizedValue.length < 2 ||
            normalizedValue.length > 100
        ) {
            throw new Error(
                `${fieldName} deben tener entre 2 y 100 caracteres`
            );
        }

        if (!/^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ\s'-]+$/.test(normalizedValue)) {
            throw new Error(
                `${fieldName} solo pueden contener letras, espacios, guiones y apóstrofes`
            );
        }

        return normalizedValue;
    }

    static normalizeEmail(value) {
        if (typeof value !== "string") {
            throw new Error("El correo electrónico es obligatorio");
        }

        const email = value.trim().toLowerCase();

        if (!email) {
            throw new Error("El correo electrónico es obligatorio");
        }

        if (email.length > 150) {
            throw new Error(
                "El correo electrónico no puede superar los 150 caracteres"
            );
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            throw new Error("Debe ingresar un correo electrónico válido");
        }

        return email;
    }

    static normalizePhone(value) {
        if (typeof value !== "string") {
            throw new Error("El teléfono es obligatorio");
        }

        const phone = value.trim();

        if (!phone) {
            throw new Error("El teléfono es obligatorio");
        }

        if (phone.length < 7 || phone.length > 20) {
            throw new Error(
                "El teléfono debe tener entre 7 y 20 caracteres"
            );
        }

        if (!/^[0-9+\s()-]+$/.test(phone)) {
            throw new Error(
                "El teléfono contiene caracteres no permitidos"
            );
        }

        return phone;
    }

    static normalizeOptionalText(value) {
        if (value === null || value === undefined || value === "") {
            return null;
        }

        if (typeof value !== "string") {
            throw new Error("La dirección debe ser un texto válido");
        }

        const normalizedValue = value.trim().replace(/\s+/g, " ");

        if (normalizedValue.length > 255) {
            throw new Error(
                "La dirección no puede superar los 255 caracteres"
            );
        }

        return normalizedValue || null;
    }

    static validateBoolean(value) {
        if (typeof value !== "boolean") {
            throw new Error(
                "El indicador de obligaciones pendientes debe ser verdadero o falso"
            );
        }

        return value;
    }

    static validateStatus(value) {
        if (!Object.values(CLIENT_STATUSES).includes(value)) {
            throw new Error(
                `El estado debe ser ${CLIENT_STATUSES.ACTIVE} o ${CLIENT_STATUSES.INACTIVE}`
            );
        }

        return value;
    }

    updatePersonalInformation({
        firstName = this.firstName,
        lastName = this.lastName,
        email = this.email,
        phone = this.phone,
        address = this.address,
    }) {
        this.firstName = Client.normalizeName(firstName, "Los nombres");
        this.lastName = Client.normalizeName(lastName, "Los apellidos");
        this.email = Client.normalizeEmail(email);
        this.phone = Client.normalizePhone(phone);
        this.address = Client.normalizeOptionalText(address);

        return this;
    }

    setPendingObligations(hasPendingObligations) {
        this.hasPendingObligations =
            Client.validateBoolean(hasPendingObligations);

        return this;
    }

    activate() {
        this.status = CLIENT_STATUSES.ACTIVE;

        return this;
    }

    deactivate() {
        this.status = CLIENT_STATUSES.INACTIVE;

        return this;
    }

    isActive() {
        return this.status === CLIENT_STATUSES.ACTIVE;
    }

    isEligibleForRenewalBonus() {
        return this.isActive() && !this.hasPendingObligations;
    }

    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    toObject() {
        return {
            id: this.id,
            identification: this.identification,
            firstName: this.firstName,
            lastName: this.lastName,
            fullName: this.getFullName(),
            email: this.email,
            phone: this.phone,
            address: this.address,
            hasPendingObligations: this.hasPendingObligations,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}