class FixedCalendarClass extends foundry.data.CalendarData {

    countLeapYears(yearsSinceLeapStart) {
        const leapInterval = this.years.leapYear?.leapInterval ?? 0;
        if(!leapInterval) return 0;
        return Math.ceil((yearsSinceLeapStart) / leapInterval);
    }

    timeToComponents(time = 0) {
        const {
            secondsPerMinute,
            minutesPerHour,
            hoursPerDay
        } = this.days;

        const secondsPerDay = secondsPerMinute * minutesPerHour * hoursPerDay;
        const { daysPerYear, daysPerLeapYear } = this;
        const leapInterval = this.years.leapYear?.leapInterval ?? 0;
        const leapStart = this.years.leapYear?.leapStart ?? 0;
        const beforeLeapStartSeconds = (leapStart - 1) * secondsPerDay * daysPerYear;
        let absoluteYear, totalSeconds = 0;

        if (!leapInterval || time < beforeLeapStartSeconds) {
            absoluteYear = Math.floor(time / (daysPerYear * secondsPerDay));
            totalSeconds = absoluteYear * daysPerYear * secondsPerDay;
        } else {
            const avgDaysPerYear = (daysPerYear * (leapInterval - 1) + daysPerLeapYear) / leapInterval;

            const secondsAfterLeapStart = time - beforeLeapStartSeconds;
            const yearsEstimate = Math.max(0, Math.floor(secondsAfterLeapStart / (avgDaysPerYear * secondsPerDay)) - leapInterval);
            const leapYearsCount = this.countLeapYears(yearsEstimate);
            const regularYearsCount = yearsEstimate - leapYearsCount + leapStart - 1;

            absoluteYear = yearsEstimate + leapStart - 1;
            totalSeconds = leapYearsCount * daysPerLeapYear * secondsPerDay + regularYearsCount * daysPerYear * secondsPerDay;
            let totalLeap = leapYearsCount
            while (true) {
                const isLeap = this.isLeapYear(absoluteYear + 1);
                const yearSeconds = (isLeap ? daysPerLeapYear : daysPerYear) * secondsPerDay;

                if (totalSeconds + yearSeconds > time) break;
                if (isLeap) totalLeap++;
                totalSeconds += yearSeconds;
                absoluteYear += 1;
            }
        }


        const year = absoluteYear;
        const leapYear = this.isLeapYear(absoluteYear + 1);
        let second = time - totalSeconds;

        const day = Math.floor(second / secondsPerDay);
        second -= day * secondsPerDay;

        // Month and Day Of Month
        let remaining = day;
        let month;
        for (month = 0; month < this.months.values.length; month++) {
            const m = this.months.values[month];
            const md = leapYear ? (m.leapDays ?? m.days) : m.days;
            if (remaining < md) break;
            remaining -= md;
        }
        const dayOfMonth = remaining;

        // Day of Week
        const totalWeekdays = Math.floor(time / secondsPerDay) + (this.years.firstWeekday ?? 0);
        const dayOfWeek = totalWeekdays % this.days.values.length;

        // Hour
        const hourSeconds = secondsPerMinute * minutesPerHour;
        const hour = Math.floor(second / hourSeconds);
        second -= hour * hourSeconds;

        // Minute
        const minute = Math.floor(second / secondsPerMinute);
        second -= minute * secondsPerMinute;

        // Season
        let season;
        for (season = 0; season < this.seasons.values.length; season++) {
            const s = this.seasons.values[season];
            let { dayStart, dayEnd, monthStart, monthEnd } = s;
            const od = day + 1;
            const om = this.months.values[month].ordinal;

            // Match on days
            if (typeof dayStart === "number" && typeof dayEnd === "number") {
                if (dayEnd < dayStart) {
                    if (od <= dayEnd) dayStart -= this.daysPerYear;
                    else if (od >= dayStart) dayEnd += this.daysPerYear;
                }
                if (od >= dayStart && od <= dayEnd) break;
            }

            // Match on months
            else if (typeof monthStart === "number" && typeof monthEnd === "number") {
                if (monthEnd < monthStart) {
                    if (om <= monthEnd) monthStart -= this.months.values.length;
                    else if (om >= monthStart) monthEnd += this.months.values.length;
                }
                if (om >= monthStart && om <= monthEnd) break;
            }

            // No match
            else {
                season = undefined;
                break;
            }
        }

        return {
            year,
            day,
            dayOfMonth,
            dayOfWeek,
            hour,
            minute,
            second,
            month,
            leapYear,
            season
        };
    }

    componentsToTime(components = {}) {
        components = { year: 0, ...components };
        const {
            secondsPerMinute,
            minutesPerHour,
            hoursPerDay
        } = this.days;

        const { daysPerYear, daysPerLeapYear } = this;

        const secondsPerDay = secondsPerMinute * minutesPerHour * hoursPerDay;
        const leapStart = this.years.leapYear?.leapStart ?? 0;

        let totalDays = 0;

        if (components.year < leapStart) {
            totalDays = components.year * daysPerYear;
        } else {
            
            const yearsAfterLeapStart = components.year - (leapStart - 1);

            const leapYearsCount = this.countLeapYears(yearsAfterLeapStart);
            const regularYearsCount = yearsAfterLeapStart - leapYearsCount;

            totalDays += leapYearsCount * daysPerLeapYear + regularYearsCount * daysPerYear + (leapStart - 1) * daysPerYear;
        }


        // Add days from the current year
        totalDays += components.day ?? 0;

        // Add hour, minute, second
        let totalSeconds = totalDays * secondsPerDay;
        totalSeconds += (components.hour ?? 0) * minutesPerHour * secondsPerMinute;
        totalSeconds += (components.minute ?? 0) * secondsPerMinute;
        totalSeconds += (components.second ?? 0);

        return totalSeconds;
    }

    get daysPerYear() {
        return this.months.values.reduce((sum, month) => {
            return sum + (month.days ?? 0);
        }, 0);
    }

    get daysPerLeapYear() {
        return this.months.values.reduce((sum, month) => {
            return sum + (month.leapDays ?? month.days ?? 0);
        }, 0);
    }

}

export class CalendarClass extends FixedCalendarClass {

    static defineSchema() {
        const fields = foundry.data.fields;
        const schema = super.defineSchema();
        schema.moons = new fields.SchemaField({
            values: new fields.ArrayField(new fields.SchemaField({
                name: new fields.StringField({ required: true, blank: false }),
                cycleLength: new fields.NumberField({ required: false, nullable: true, positive: true }),
                phaseNames: new fields.ArrayField(new fields.StringField(), { required: false, nullable: true }),
                offset: new fields.NumberField({ required: false, nullable: true, integer: true })
            }))
        }, { required: false, nullable: true, initial: null })
        schema.months = new fields.SchemaField({
            values: new fields.ArrayField(new fields.SchemaField({
                name: new fields.StringField({ required: true, blank: false }),
                abbreviation: new fields.StringField(),
                ordinal: new fields.NumberField({ required: true, nullable: false, min: 1, integer: true }),
                days: new fields.NumberField({ required: true, nullable: false }),
                leapDays: new fields.NumberField({ required: false, nullable: true }),
                dawn: new fields.NumberField({ required: false, nullable: true, min: 0, max: 1, integer: false }),
                dusk: new fields.NumberField({ required: false, nullable: true, min: 0, max: 1, integer: false }),
                intercalary: new fields.BooleanField({ required: false, nullable: true }),
                startingWeekday: new fields.NumberField({ required: false, nullable: true, integer: true })
            }))
        }, { required: true, nullable: true, initial: null })

        return schema;
    }

    timeToComponents(...args) {
        const components = super.timeToComponents(...args);
        const startingWeekday = CONFIG.time.worldCalendarConfig.months.values[components.month].startingWeekday ?? null;
        if (Number.isFinite(startingWeekday)) {
            components.dayOfWeek = (components.dayOfMonth + startingWeekday) % this.days.values.length;
        }
        return components;
    }
}