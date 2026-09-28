const GREGORIAN = {
    "name": "Simplified Gregorian",
    "id": "gregorian",
    "description": "The Gregorian calendar with some simplifications regarding leap years or seasonal timing.",
    "years": {
        "yearZero": 0,
        "firstWeekday": 0,
        "leapYear": {
            "leapStart": 8,
            "leapInterval": 4
        }
    },
    "months": {
        "values": [
            {
                "name": "CALENDAR.GREGORIAN.January",
                "abbreviation": "CALENDAR.GREGORIAN.JanuaryAbbr",
                "ordinal": 1,
                "days": 31
            },
            {
                "name": "CALENDAR.GREGORIAN.February",
                "abbreviation": "CALENDAR.GREGORIAN.FebruaryAbbr",
                "ordinal": 2,
                "days": 28,
                "leapDays": 29
            },
            {
                "name": "CALENDAR.GREGORIAN.March",
                "abbreviation": "CALENDAR.GREGORIAN.MarchAbbr",
                "ordinal": 3,
                "days": 31
            },
            {
                "name": "CALENDAR.GREGORIAN.April",
                "abbreviation": "CALENDAR.GREGORIAN.AprilAbbr",
                "ordinal": 4,
                "days": 30
            },
            {
                "name": "CALENDAR.GREGORIAN.May",
                "abbreviation": "CALENDAR.GREGORIAN.MayAbbr",
                "ordinal": 5,
                "days": 31
            },
            {
                "name": "CALENDAR.GREGORIAN.June",
                "abbreviation": "CALENDAR.GREGORIAN.JuneAbbr",
                "ordinal": 6,
                "days": 30
            },
            {
                "name": "CALENDAR.GREGORIAN.July",
                "abbreviation": "CALENDAR.GREGORIAN.JulyAbbr",
                "ordinal": 7,
                "days": 31
            },
            {
                "name": "CALENDAR.GREGORIAN.August",
                "abbreviation": "CALENDAR.GREGORIAN.AugustAbbr",
                "ordinal": 8,
                "days": 31
            },
            {
                "name": "CALENDAR.GREGORIAN.September",
                "abbreviation": "CALENDAR.GREGORIAN.SeptemberAbbr",
                "ordinal": 9,
                "days": 30
            },
            {
                "name": "CALENDAR.GREGORIAN.October",
                "abbreviation": "CALENDAR.GREGORIAN.OctoberAbbr",
                "ordinal": 10,
                "days": 31
            },
            {
                "name": "CALENDAR.GREGORIAN.November",
                "abbreviation": "CALENDAR.GREGORIAN.NovemberAbbr",
                "ordinal": 11,
                "days": 30
            },
            {
                "name": "CALENDAR.GREGORIAN.December",
                "abbreviation": "CALENDAR.GREGORIAN.DecemberAbbr",
                "ordinal": 12,
                "days": 31
            }
        ]
    },
    "days": {
        "values": [
            {
                "name": "CALENDAR.GREGORIAN.Monday",
                "abbreviation": "CALENDAR.GREGORIAN.MondayAbbr",
                "ordinal": 1
            },
            {
                "name": "CALENDAR.GREGORIAN.Tuesday",
                "abbreviation": "CALENDAR.GREGORIAN.TuesdayAbbr",
                "ordinal": 2
            },
            {
                "name": "CALENDAR.GREGORIAN.Wednesday",
                "abbreviation": "CALENDAR.GREGORIAN.WednesdayAbbr",
                "ordinal": 3
            },
            {
                "name": "CALENDAR.GREGORIAN.Thursday",
                "abbreviation": "CALENDAR.GREGORIAN.ThursdayAbbr",
                "ordinal": 4
            },
            {
                "name": "CALENDAR.GREGORIAN.Friday",
                "abbreviation": "CALENDAR.GREGORIAN.FridayAbbr",
                "ordinal": 5
            },
            {
                "name": "CALENDAR.GREGORIAN.Saturday",
                "abbreviation": "CALENDAR.GREGORIAN.SaturdayAbbr",
                "ordinal": 6,
                "isRestDay": true
            },
            {
                "name": "CALENDAR.GREGORIAN.Sunday",
                "abbreviation": "CALENDAR.GREGORIAN.SundayAbbr",
                "ordinal": 7,
                "isRestDay": true
            }
        ],
        "daysPerYear": 365,
        "hoursPerDay": 24,
        "minutesPerHour": 60,
        "secondsPerMinute": 60
    },
    "seasons": {
        "values": [
            {
                "name": "CALENDAR.GREGORIAN.Spring",
                "monthStart": 3,
                "monthEnd": 5
            },
            {
                "name": "CALENDAR.GREGORIAN.Summer",
                "monthStart": 6,
                "monthEnd": 8
            },
            {
                "name": "CALENDAR.GREGORIAN.Fall",
                "monthStart": 9,
                "monthEnd": 11
            },
            {
                "name": "CALENDAR.GREGORIAN.Winter",
                "monthStart": 12,
                "monthEnd": 2
            }
        ]
    },
    "moons": {
        "values": [
            {
                "name": "Moon",
                "cycleLength": 30,
                "offset": 0
            }
        ]
    }
}

const HARPTOS = {
    "name": "Harptos (Forgotten Realms)",
    "id": "harptos",
    "system": "dnd5e",
    "description": "The standard calendar of the Forgotten Realms, consisting of twelve 30-day months punctuated by five annual festival days.",
    "years": {
        "yearZero": 0,
        "firstWeekday": 0,
        "leapYear": {
            "leapStart": 4,
            "leapInterval": 4
        }
    },
    "months": {
        "values": [
            {
                "name": "Hammer",
                "abbreviation": "Ham",
                "ordinal": 1,
                "days": 30,
                "startingWeekday": 0,
            },
            {
                "name": "Midwinter",
                "abbreviation": "Mid",
                "ordinal": 1,
                "days": 1,
                "startingWeekday": 0,
                "intercalary": true,
            },
            {
                "name": "Alturiak",
                "abbreviation": "Alt",
                "ordinal": 2,
                "days": 30,
                "startingWeekday": 0,
            },
            {
                "name": "Ches",
                "abbreviation": "Che",
                "ordinal": 3,
                "days": 30,
                "startingWeekday": 0,
            },
            {
                "name": "Tarsakh",
                "abbreviation": "Tar",
                "ordinal": 4,
                "days": 30,
                "startingWeekday": 0,
            },
            {
                "name": "Greengrass",
                "abbreviation": "Gre",
                "ordinal": 4,
                "days": 1,
                "intercalary": true,
                "startingWeekday": 0,
            },
            {
                "name": "Mirtul",
                "abbreviation": "Mir",
                "ordinal": 5,
                "days": 30,
                "startingWeekday": 0,
            },
            {
                "name": "Kythorn",
                "abbreviation": "Kyt",
                "ordinal": 6,
                "days": 30,
                "startingWeekday": 0,
            },
            {
                "name": "Flamerule",
                "abbreviation": "Fla",
                "ordinal": 7,
                "days": 30,
                "startingWeekday": 0,
            },
            {
                "name": "Midsummer",
                "abbreviation": "Mid",
                "ordinal": 7,
                "days": 1,
                "intercalary": true,
                "startingWeekday": 0,
            },
            {
                "name": "Shieldmeet",
                "abbreviation": "Shi",
                "ordinal": 7,
                "days": 0,
                "leapDays": 1,
                "intercalary": true,
                "startingWeekday": 0,
            },
            {
                "name": "Eleasis",
                "abbreviation": "Ele",
                "ordinal": 8,
                "days": 30,
                "startingWeekday": 0,
            },
            {
                "name": "Eleint",
                "abbreviation": "El",
                "ordinal": 9,
                "days": 30,
                "startingWeekday": 0,
            },
            {
                "name": "Highharvestide",
                "abbreviation": "Hig",
                "ordinal": 9,
                "days": 1,
                "intercalary": true,
                "startingWeekday": 0,
            },
            {
                "name": "Marpenoth",
                "abbreviation": "Mar",
                "ordinal": 10,
                "days": 30,
                "startingWeekday": 0,
            },
            {
                "name": "Uktar",
                "abbreviation": "Ukt",
                "ordinal": 11,
                "days": 30,
                "startingWeekday": 0,
            },
            {
                "name": "Feast of the Moon",
                "abbreviation": "Fes",
                "ordinal": 11,
                "days": 1,
                "intercalary": true,
                "startingWeekday": 0,
            },
            {
                "name": "Nightal",
                "abbreviation": "Nig",
                "ordinal": 12,
                "days": 30,
                "startingWeekday": 0,
            }
        ]
    },
    "days": {
        "values": [
            {
                "name": "First-day",
                "abbreviation": "1D",
                "ordinal": 1
            },
            {
                "name": "Second-day",
                "abbreviation": "2D",
                "ordinal": 2
            },
            {
                "name": "Third-day",
                "abbreviation": "3D",
                "ordinal": 3
            },
            {
                "name": "Fourth-day",
                "abbreviation": "4D",
                "ordinal": 4
            },
            {
                "name": "Fifth-day",
                "abbreviation": "5D",
                "ordinal": 5
            },
            {
                "name": "Sixth-day",
                "abbreviation": "6D",
                "ordinal": 6
            },
            {
                "name": "Seventh-day",
                "abbreviation": "7D",
                "ordinal": 7
            },
            {
                "name": "Eighth-day",
                "abbreviation": "8D",
                "ordinal": 8
            },
            {
                "name": "Ninth-day",
                "abbreviation": "9D",
                "ordinal": 9
            },
            {
                "name": "Tenth-day",
                "abbreviation": "10D",
                "ordinal": 10
            }
        ],
        "daysPerYear": 365,
        "hoursPerDay": 24,
        "minutesPerHour": 60,
        "secondsPerMinute": 60
    },
    "seasons": {
        "values": [
            {
                "name": "Spring",
                "monthStart": 3,
                "monthEnd": 6,
                "dayStart": 78,
                "dayEnd": 171
            },
            {
                "name": "Summer",
                "monthStart": 6,
                "monthEnd": 9,
                "dayStart": 171,
                "dayEnd": 264
            },
            {
                "name": "Autumn",
                "monthStart": 9,
                "monthEnd": 12,
                "dayStart": 264,
                "dayEnd": 354
            },
            {
                "name": "Winter",
                "monthStart": 12,
                "monthEnd": 3,
                "dayStart": 354,
                "dayEnd": 78
            }
        ]
    },
    "moons": {
        "values": [
            {
                "name": "Selûne",
                "cycleLength": 30,
                "offset": 0
            }
        ]
    }
}

const BAROVIAN = {
  "name": "Barovian (Curse of Strahd)",
  "id": "barovian",
  "description": "The calendar used in the cursed land of Barovia, featured in the Curse of Strahd campaign. It features 12 months, each with 28 days.",
  "years": {
    "yearZero": 735,
    "firstWeekday": 0
  },
  "months": {
    "values": [
      {
        "name": "Yinyavr (Cold Moon)",
        "abbreviation": "Yin",
        "ordinal": 1,
        "days": 28,
        "dawn": 0.291666,
        "dusk": 0.708333
      },
      {
        "name": "Fenravr (Wolf Moon)",
        "abbreviation": "Fen",
        "ordinal": 2,
        "days": 28,
        "dawn": 0.291666,
        "dusk": 0.708333
      },
      {
        "name": "Martavr (Raven Moon)",
        "abbreviation": "Mar",
        "ordinal": 3,
        "days": 28,
        "dawn": 0.291666,
        "dusk": 0.708333
      },
      {
        "name": "Prylla (Rain Moon)",
        "abbreviation": "Pry",
        "ordinal": 4,
        "days": 28,
        "dawn": 0.291666,
        "dusk": 0.708333
      },
      {
        "name": "Mada (Maid Moon)",
        "abbreviation": "Mad",
        "ordinal": 5,
        "days": 28,
        "dawn": 0.291666,
        "dusk": 0.708333
      },
      {
        "name": "Eyun (Summer Moon)",
        "abbreviation": "Eyu",
        "ordinal": 6,
        "days": 28,
        "dawn": 0.291666,
        "dusk": 0.708333
      },
      {
        "name": "Eyul (War Moon)",
        "abbreviation": "Eyl",
        "ordinal": 7,
        "days": 28,
        "dawn": 0.291666,
        "dusk": 0.708333
      },
      {
        "name": "Ugavr (Wine Moon)",
        "abbreviation": "Uga",
        "ordinal": 8,
        "days": 28,
        "dawn": 0.291666,
        "dusk": 0.708333
      },
      {
        "name": "Sintavr (Harvest Moon)",
        "abbreviation": "Sin",
        "ordinal": 9,
        "days": 28,
        "dawn": 0.291666,
        "dusk": 0.708333
      },
      {
        "name": "Ottyavr (Hunter's Moon)",
        "abbreviation": "Ott",
        "ordinal": 10,
        "days": 28,
        "dawn": 0.291666,
        "dusk": 0.708333
      },
      {
        "name": "Neyavr (Rot Moon)",
        "abbreviation": "Ney",
        "ordinal": 11,
        "days": 28,
        "dawn": 0.291666,
        "dusk": 0.708333
      },
      {
        "name": "Dekavr (Winter Moon)",
        "abbreviation": "Dek",
        "ordinal": 12,
        "days": 28,
        "dawn": 0.291666,
        "dusk": 0.708333
      }
    ]
  },
  "days": {
    "values": [
      {
        "name": "Vasárnap",
        "abbreviation": "1st",
        "ordinal": 1
      },
      {
        "name": "Hétfő",
        "abbreviation": "2nd",
        "ordinal": 2
      },
      {
        "name": "Kedd",
        "abbreviation": "3rd",
        "ordinal": 3
      },
      {
        "name": "Szerda",
        "abbreviation": "4th",
        "ordinal": 4
      },
      {
        "name": "Csütörtök",
        "abbreviation": "5th",
        "ordinal": 5
      },
      {
        "name": "Péntek",
        "abbreviation": "6th",
        "ordinal": 6
      },
      {
        "name": "Szombat",
        "abbreviation": "7th",
        "ordinal": 7
      }
    ],
    "daysPerYear": 336,
    "hoursPerDay": 24,
    "minutesPerHour": 60,
    "secondsPerMinute": 60
  },
  "seasons": {
    "values": [
      {
        "name": "Spring",
        "abbreviation": "Spr",
        "dayStart": 29,
        "dayEnd": 113
      },
      {
        "name": "Summer",
        "abbreviation": "Sum",
        "dayStart": 113,
        "dayEnd": 197
      },
      {
        "name": "Autumn",
        "abbreviation": "Aut",
        "dayStart": 197,
        "dayEnd": 281
      },
      {
        "name": "Winter",
        "abbreviation": "Win",
        "dayStart": 281,
        "dayEnd": 29
      }
    ]
  },
  "moons": {
    "values": [
      {
        "name": "Selûne",
        "cycleLength": 28,
        "offset": 14
      }
    ]
  }
}

const GALIFAR = {
    "name": "Galifar (Eberron)",
    "id": "galifar",
    "description": "The calendar used in Eberron, featuring 12 months of 28 days and a consistent 7-day week with no leap years or intercalary days.",
    "years": {
        "yearZero": 0,
        "firstWeekday": 0
    },
    "months": {
        "values": [
            { "name": "Zarantyr", "abbreviation": "Zar", "ordinal": 1, "days": 28 },
            { "name": "Olarune", "abbreviation": "Ola", "ordinal": 2, "days": 28 },
            { "name": "Therendor", "abbreviation": "The", "ordinal": 3, "days": 28 },
            { "name": "Eyre", "abbreviation": "Eyr", "ordinal": 4, "days": 28 },
            { "name": "Dravago", "abbreviation": "Dra", "ordinal": 5, "days": 28 },
            { "name": "Nymm", "abbreviation": "Nym", "ordinal": 6, "days": 28 },
            { "name": "Lharvion", "abbreviation": "Lha", "ordinal": 7, "days": 28 },
            { "name": "Barrakas", "abbreviation": "Bar", "ordinal": 8, "days": 28 },
            { "name": "Rhaan", "abbreviation": "Rha", "ordinal": 9, "days": 28 },
            { "name": "Sypheros", "abbreviation": "Syp", "ordinal": 10, "days": 28 },
            { "name": "Aryth", "abbreviation": "Ary", "ordinal": 11, "days": 28 },
            { "name": "Vult", "abbreviation": "Vul", "ordinal": 12, "days": 28 }
        ]
    },
    "days": {
        "values": [
            { "name": "Sul", "abbreviation": "Sul", "ordinal": 1 },
            { "name": "Mol", "abbreviation": "Mol", "ordinal": 2 },
            { "name": "Zol", "abbreviation": "Zol", "ordinal": 3 },
            { "name": "Wir", "abbreviation": "Wir", "ordinal": 4 },
            { "name": "Zor", "abbreviation": "Zor", "ordinal": 5 },
            { "name": "Far", "abbreviation": "Far", "ordinal": 6 },
            { "name": "Sar", "abbreviation": "Sar", "ordinal": 7, "isRestDay": true }
        ],
        "daysPerYear": 336,
        "hoursPerDay": 24,
        "minutesPerHour": 60,
        "secondsPerMinute": 60
    },
    "seasons": {
        "values": [
            { "name": "Spring", "monthStart": 3, "monthEnd": 5 },
            { "name": "Summer", "monthStart": 6, "monthEnd": 8 },
            { "name": "Autumn", "monthStart": 9, "monthEnd": 11 },
            { "name": "Winter", "monthStart": 12, "monthEnd": 2 }
        ]
    }
}

const GOLARION = {
    "name": "Golarion (Pathfinder)",
    "id": "golarion",
    "description": "The Absalom Reckoning calendar used in the Pathfinder setting, featuring 12 months with varying lengths and a 7-day week.",
    "years": {
        "yearZero": 1,
        "firstWeekday": 0,
        "leapYear": {
            "leapStart": 4,
            "leapInterval": 4
        }
    },
    "months": {
        "values": [
            { "name": "Abadius", "abbreviation": "Abad", "ordinal": 1, "days": 31 },
            { "name": "Calistril", "abbreviation": "Cal", "ordinal": 2, "days": 28, "leapDays": 29 },
            { "name": "Pharast", "abbreviation": "Phar", "ordinal": 3, "days": 31 },
            { "name": "Gozran", "abbreviation": "Goz", "ordinal": 4, "days": 30 },
            { "name": "Desnus", "abbreviation": "Des", "ordinal": 5, "days": 31 },
            { "name": "Sarenith", "abbreviation": "Sar", "ordinal": 6, "days": 30 },
            { "name": "Erastus", "abbreviation": "Era", "ordinal": 7, "days": 31 },
            { "name": "Arodus", "abbreviation": "Aro", "ordinal": 8, "days": 31 },
            { "name": "Rova", "abbreviation": "Rov", "ordinal": 9, "days": 30 },
            { "name": "Lamashan", "abbreviation": "Lam", "ordinal": 10, "days": 31 },
            { "name": "Neth", "abbreviation": "Neth", "ordinal": 11, "days": 30 },
            { "name": "Kuthona", "abbreviation": "Kuth", "ordinal": 12, "days": 31 }
        ]
    },
    "days": {
        "values": [
            { "name": "Moonday", "abbreviation": "Mon", "ordinal": 1 },
            { "name": "Toilday", "abbreviation": "Tue", "ordinal": 2 },
            { "name": "Wealday", "abbreviation": "Wed", "ordinal": 3 },
            { "name": "Oathday", "abbreviation": "Thu", "ordinal": 4 },
            { "name": "Fireday", "abbreviation": "Fri", "ordinal": 5 },
            { "name": "Starday", "abbreviation": "Sat", "ordinal": 6 },
            { "name": "Sunday", "abbreviation": "Sun", "ordinal": 7, "isRestDay": true }
        ],
        "daysPerYear": 365,
        "hoursPerDay": 24,
        "minutesPerHour": 60,
        "secondsPerMinute": 60
    },
    "seasons": {
        "values": [
            { "name": "Winter", "monthStart": 1, "monthEnd": 2 },
            { "name": "Spring", "monthStart": 3, "monthEnd": 5 },
            { "name": "Summer", "monthStart": 6, "monthEnd": 8 },
            { "name": "Autumn", "monthStart": 9, "monthEnd": 11 }
        ]
    },
    "moons": {
        "values": [
            {
                "name": "Somal",
                "cycleLength": 30,
                "offset": 0
            }
        ]
    }
}

const THYATIAN = {
    "name": "Thyatian (Mystara)",
    "id": "thyatian",
    "description": "The Thyatian calendar used in the Mystara setting, closely resembling the Gregorian calendar with 12 months and a 7-day week.",
    "years": {
        "yearZero": 0,
        "firstWeekday": 0,
        "leapYear": {
            "leapStart": 4,
            "leapInterval": 4
        }
    },
    "months": {
        "values": [
            { "name": "Nuwmont", "abbreviation": "Nuw", "ordinal": 1, "days": 31 },
            { "name": "Vatermont", "abbreviation": "Vat", "ordinal": 2, "days": 28, "leapDays": 29 },
            { "name": "Thaumont", "abbreviation": "Thau", "ordinal": 3, "days": 31 },
            { "name": "Flaurmont", "abbreviation": "Flau", "ordinal": 4, "days": 30 },
            { "name": "Yarthmont", "abbreviation": "Yar", "ordinal": 5, "days": 31 },
            { "name": "Klarmont", "abbreviation": "Klar", "ordinal": 6, "days": 30 },
            { "name": "Felmont", "abbreviation": "Fel", "ordinal": 7, "days": 31 },
            { "name": "Fyrmont", "abbreviation": "Fyr", "ordinal": 8, "days": 31 },
            { "name": "Ambyrmont", "abbreviation": "Amb", "ordinal": 9, "days": 30 },
            { "name": "Sviftmont", "abbreviation": "Svi", "ordinal": 10, "days": 31 },
            { "name": "Eirmont", "abbreviation": "Eir", "ordinal": 11, "days": 30 },
            { "name": "Kaldmont", "abbreviation": "Kal", "ordinal": 12, "days": 31 }
        ]
    },
    "days": {
        "values": [
            { "name": "Soladain", "abbreviation": "Sol", "ordinal": 1 },
            { "name": "Lunadain", "abbreviation": "Lun", "ordinal": 2 },
            { "name": "Gromdain", "abbreviation": "Gro", "ordinal": 3 },
            { "name": "Tserdain", "abbreviation": "Tse", "ordinal": 4 },
            { "name": "Moldain", "abbreviation": "Mol", "ordinal": 5 },
            { "name": "Nytdain", "abbreviation": "Nyt", "ordinal": 6 },
            { "name": "Loshdain", "abbreviation": "Los", "ordinal": 7, "isRestDay": true }
        ],
        "daysPerYear": 365,
        "hoursPerDay": 24,
        "minutesPerHour": 60,
        "secondsPerMinute": 60
    },
    "seasons": {
        "values": [
            { "name": "Winter", "monthStart": 1, "monthEnd": 2 },
            { "name": "Spring", "monthStart": 3, "monthEnd": 5 },
            { "name": "Summer", "monthStart": 6, "monthEnd": 8 },
            { "name": "Autumn", "monthStart": 9, "monthEnd": 11 }
        ]
    }
}

const COMMONYEAR = {
    "name": "Common Year (Greyhawk)",
    "id": "commonyear",
    "description": "The Common Year calendar used in the World of Greyhawk setting, featuring 12 months of 28 days and four 7-day festivals.",
    "years": {
        "yearZero": 0,
        "firstWeekday": 0
    },
    "months": {
        "values": [
            { "name": "Fireseek", "abbreviation": "Fir", "ordinal": 1, "days": 28 },
            { "name": "Readying", "abbreviation": "Rea", "ordinal": 2, "days": 28 },
            { "name": "Coldeven", "abbreviation": "Col", "ordinal": 3, "days": 28 },
            { "name": "Planting", "abbreviation": "Pla", "ordinal": 4, "days": 28 },
            { "name": "Flocktime", "abbreviation": "Flo", "ordinal": 5, "days": 28 },
            { "name": "Wealsun", "abbreviation": "Wea", "ordinal": 6, "days": 28 },
            { "name": "Reaping", "abbreviation": "Rea", "ordinal": 7, "days": 28 },
            { "name": "Goodmonth", "abbreviation": "Goo", "ordinal": 8, "days": 28 },
            { "name": "Harvester", "abbreviation": "Har", "ordinal": 9, "days": 28 },
            { "name": "Patchwall", "abbreviation": "Pat", "ordinal": 10, "days": 28 },
            { "name": "Ready'reat", "abbreviation": "Rea", "ordinal": 11, "days": 28 },
            { "name": "Sunsebb", "abbreviation": "Sun", "ordinal": 12, "days": 28 }
        ]
    },
    "days": {
        "values": [
            { "name": "Starday", "abbreviation": "Sta", "ordinal": 1 },
            { "name": "Sunday", "abbreviation": "Sun", "ordinal": 2 },
            { "name": "Moonday", "abbreviation": "Mon", "ordinal": 3 },
            { "name": "Godsday", "abbreviation": "God", "ordinal": 4 },
            { "name": "Waterday", "abbreviation": "Wat", "ordinal": 5 },
            { "name": "Earthday", "abbreviation": "Ear", "ordinal": 6 },
            { "name": "Freeday", "abbreviation": "Fre", "ordinal": 7, "isRestDay": true }
        ],
        "daysPerYear": 336,
        "hoursPerDay": 24,
        "minutesPerHour": 60,
        "secondsPerMinute": 60
    },
    "seasons": {
        "values": [
            { "name": "Spring", "monthStart": 3, "monthEnd": 5 },
            { "name": "Summer", "monthStart": 6, "monthEnd": 8 },
            { "name": "Autumn", "monthStart": 9, "monthEnd": 11 },
            { "name": "Winter", "monthStart": 12, "monthEnd": 2 },
        ]
    }
}

const ATHASIAN = {
    "name": "Athasian (Dark Sun)",
    "id": "athasian",
    "description": "The Athasian calendar used in the Dark Sun setting. It has 10 months of 36 days each, with 5 festival days.",
    "years": {
        "yearZero": 0,
        "firstWeekday": 0
    },
    "months": {
        "values": [
            { "name": "Sorrow", "abbreviation": "Sor", "ordinal": 1, "days": 36 },
            { "name": "Sunbirth", "abbreviation": "Sun", "ordinal": 2, "days": 36 },
            { "name": "Ral's Rest", "abbreviation": "Ral", "ordinal": 3, "days": 36 },
            { "name": "Windfury", "abbreviation": "Win", "ordinal": 4, "days": 36 },
            { "name": "Sea's Fury", "abbreviation": "Sea", "ordinal": 5, "days": 36 },
            { "name": "Sun Descending", "abbreviation": "Des", "ordinal": 6, "days": 36 },
            { "name": "Fireseek", "abbreviation": "Fir", "ordinal": 7, "days": 36 },
            { "name": "Dragon's Rest", "abbreviation": "Dra", "ordinal": 8, "days": 36 },
            { "name": "Smoldering", "abbreviation": "Smo", "ordinal": 9, "days": 36 },
            { "name": "Cooling", "abbreviation": "Coo", "ordinal": 10, "days": 36 }
        ]
    },
    "days": {
        "values": [
            { "name": "Firstday", "abbreviation": "F1", "ordinal": 1 },
            { "name": "Secondday", "abbreviation": "F2", "ordinal": 2 },
            { "name": "Thirdday", "abbreviation": "F3", "ordinal": 3 },
            { "name": "Fourthday", "abbreviation": "F4", "ordinal": 4 },
            { "name": "Fifthday", "abbreviation": "F5", "ordinal": 5 },
            { "name": "Sixthday", "abbreviation": "F6", "ordinal": 6 }
        ],
        "daysPerYear": 360,
        "hoursPerDay": 24,
        "minutesPerHour": 60,
        "secondsPerMinute": 60
    }
}
const DRAG_SOLAMNIA = {
    "name": "Dragonlance (Solamnia, Ansalon)",
    "id": "drag_solamnia",
    "description": "The standard calendar used in Solamnia on the Ansalon continent, with 12 months of 28 days each. The Moons of Magic orbit around the world of Krynn, their cycle affecting Wizards of High Sorcery. The moon's cycle are named after how mages are affected.",
    "years": {
        "yearZero": 0,
        "firstWeekday": 0
    },
    "months": {
        "values": [
            { "name": "Newkolt", "ordinal": 1, "days": 28 },
            { "name": "Deepkolt", "ordinal": 2, "days": 28 },
            { "name": "Brookgreen", "ordinal": 3, "days": 28 },
            { "name": "Yurthgreen", "ordinal": 4, "days": 28 },
            { "name": "Fleurgreen", "ordinal": 5, "days": 28 },
            { "name": "Holmswelth", "ordinal": 6, "days": 28 },
            { "name": "Fierswelt", "ordinal": 7, "days": 28 },
            { "name": "Paleswelt", "ordinal": 8, "days": 28 },
            { "name": "Reapember", "ordinal": 9, "days": 28 },
            { "name": "Gildember", "ordinal": 10, "days": 28 },
            { "name": "Darkember", "ordinal": 11, "days": 28 },
            { "name": "Frostkolt", "ordinal": 12, "days": 28 }
        ]
    },
    "days": {
        "values": [
            { "name": "Linaras", "ordinal": 1 },
            { "name": "Palast", "ordinal": 2 },
            { "name": "Majetag", "ordinal": 3 },
            { "name": "Kirinor", "ordinal": 4 },
            { "name": "Misham", "ordinal": 5 },
            { "name": "Bakukal", "ordinal": 6 },
            { "name": "Bracha", "ordinal": 7 }
        ],
        "daysPerYear": 336,
        "hoursPerDay": 24,
        "minutesPerHour": 60,
        "secondsPerMinute": 60
    },
    "moons": {
        "values": [
            {
                "name": "Solinari",
                "abbreviation": "Sol",
                "cycleLength": 36,
                "phaseNames": [
                    "Low Sanction",
                    "Waxing",
                    "High Sanction",
                    "Waning"
                ],
                "offset": 0
            },
            {
                "name": "Lunitari",
                "abbreviation": "Lun",
                "cycleLength": 28,
                "phaseNames": [
                    "Low Sanction",
                    "Waxing",
                    "High Sanction",
                    "Waning"
                ],
                "offset": 0
            },
            {
                "name": "Nuitari",
                "abbreviation": "Nui",
                "cycleLength": 8,
                "phaseNames": [
                    "Low Sanction",
                    "Waxing",
                    "High Sanction",
                    "Waning"
                ],
                "offset": 0
            }
        ]
    }
}

const DRAG_ELVEN = {
    "name": "Dragonlance (Elves, Ansalon)",
    "id": "ansalon",
    "description": "The standard calendar used by the elves on the Ansalon continent, with 12 months of 28 days each. The Moons of Magic orbit around the world of Krynn, their cycle affecting Wizards of High Sorcery. The moon's cycle are named after how mages are affected.",
    "years": {
        "yearZero": 0,
        "firstWeekday": 0
    },
    "months": {
        "values": [
            { "name": "Winter Night", "ordinal": 1, "days": 28 },
            { "name": "Winter Deep", "ordinal": 2, "days": 28 },
            { "name": "Spring Dawning", "ordinal": 3, "days": 28 },
            { "name": "Spring Rain", "ordinal": 4, "days": 28 },
            { "name": "Spring Blossom", "ordinal": 5, "days": 28 },
            { "name": "Summer Home", "ordinal": 6, "days": 28 },
            { "name": "Summer Run", "ordinal": 7, "days": 28 },
            { "name": "Summer End", "ordinal": 8, "days": 28 },
            { "name": "Autumn Harvest", "ordinal": 9, "days": 28 },
            { "name": "Autumn Twilight", "ordinal": 10, "days": 28 },
            { "name": "Autumn Dark", "ordinal": 11, "days": 28 },
            { "name": "Winter Come", "ordinal": 12, "days": 28 }
        ]
    },
    "days": {
        "values": [
            { "name": "Gateway", "ordinal": 1 },
            { "name": "Bright Eye", "ordinal": 2 },
            { "name": "Night's Eye ", "ordinal": 3 },
            { "name": "Dead Eye", "ordinal": 4 },
            { "name": "Dream Dance", "ordinal": 5 },
            { "name": "Winged Trade", "ordinal": 6 },
            { "name": "World Tree", "ordinal": 7 }
        ],
        "daysPerYear": 336,
        "hoursPerDay": 24,
        "minutesPerHour": 60,
        "secondsPerMinute": 60
    },
    "moons": {
        "values": [
            {
                "name": "Solinari",
                "abbreviation": "Sol",
                "cycleLength": 36,
                "phaseNames": [
                    "Low Sanction",
                    "Waxing",
                    "High Sanction",
                    "Waning"
                ],
                "offset": 0
            },
            {
                "name": "Lunitari",
                "abbreviation": "Lun",
                "cycleLength": 28,
                "phaseNames": [
                    "Low Sanction",
                    "Waxing",
                    "High Sanction",
                    "Waning"
                ],
                "offset": 0
            },
            {
                "name": "Nuitari",
                "abbreviation": "Nui",
                "cycleLength": 8,
                "phaseNames": [
                    "Low Sanction",
                    "Waxing",
                    "High Sanction",
                    "Waning"
                ],
                "offset": 0
            }
        ]
    }
}

const CERILIAN = {
    "name": "Cerilian Reckoning (Birthright)",
    "id": "cerilian",
    "description": "The calendar of Cerilia, used in the Birthright setting. 12 months, 30 days each, plus festivals.",
    "years": {
        "yearZero": 0,
        "firstWeekday": 0
    },
    "months": {
        "values": [
            { "name": "Roelir", "abbreviation": "Roel.", "ordinal": 1, "days": 30 },
            { "name": "Haelynir", "abbreviation": "Hael.", "ordinal": 2, "days": 30 },
            { "name": "Anarire", "abbreviation": "Anar.", "ordinal": 3, "days": 30 },
            { "name": "Talienir", "abbreviation": "Tali.", "ordinal": 4, "days": 30 },
            { "name": "Roele", "abbreviation": "Roele", "ordinal": 5, "days": 30 },
            { "name": "Deismir", "abbreviation": "Deis.", "ordinal": 6, "days": 30 },
            { "name": "Erntenir", "abbreviation": "Ernt.", "ordinal": 7, "days": 30 },
            { "name": "Sehnir", "abbreviation": "Sehn.", "ordinal": 8, "days": 30 },
            { "name": "Emmanir", "abbreviation": "Emma.", "ordinal": 9, "days": 30 },
            { "name": "Keltier", "abbreviation": "Kelt.", "ordinal": 10, "days": 30 },
            { "name": "Krylinir", "abbreviation": "Kryl.", "ordinal": 11, "days": 30 },
            { "name": "Sidhevair", "abbreviation": "Sidh.", "ordinal": 12, "days": 30 }
        ]
    },
    "days": {
        "values": [
            { "name": "Sunday", "abbreviation": "Sun", "ordinal": 1 },
            { "name": "Moonday", "abbreviation": "Moon", "ordinal": 2 },
            { "name": "Earthday", "abbreviation": "Earth", "ordinal": 3 },
            { "name": "Wineday", "abbreviation": "Wine", "ordinal": 4 },
            { "name": "Stormday", "abbreviation": "Storm", "ordinal": 5 },
            { "name": "Kingsday", "abbreviation": "King", "ordinal": 6 },
            { "name": "Starday", "abbreviation": "Star", "ordinal": 7 }
        ],
        "daysPerYear": 360,
        "hoursPerDay": 24,
        "minutesPerHour": 60,
        "secondsPerMinute": 60
    }
}

const EXANDRIAN = {
    "name": "Exandrian (Exandria)",
    "id": "exandrian",
    "description": "A calendar with 328 days over 11 months, used across Exandria. It features a 7-day week and seasonal shifts based on the northern hemisphere.",
    "years": {
        "yearZero": 0,
        "firstWeekday": 0
    },
    "months": {
        "values": [
            { "name": "Horisal", "abbreviation": "Hor", "ordinal": 1, "days": 29 },
            { "name": "Misuthar", "abbreviation": "Mis", "ordinal": 2, "days": 30 },
            { "name": "Dualahei", "abbreviation": "Dua", "ordinal": 3, "days": 30 },
            { "name": "Thunsheer", "abbreviation": "Thu", "ordinal": 4, "days": 31 },
            { "name": "Unndilar", "abbreviation": "Unn", "ordinal": 5, "days": 28 },
            { "name": "Brussendar", "abbreviation": "Bru", "ordinal": 6, "days": 31 },
            { "name": "Sydenstar", "abbreviation": "Syd", "ordinal": 7, "days": 32 },
            { "name": "Fessuran", "abbreviation": "Fes", "ordinal": 8, "days": 29 },
            { "name": "Quen'pillar", "abbreviation": "Que", "ordinal": 9, "days": 27 },
            { "name": "Cuersaar", "abbreviation": "Cue", "ordinal": 10, "days": 29 },
            { "name": "Duscar", "abbreviation": "Dus", "ordinal": 11, "days": 32 }
        ]
    },
    "days": {
        "values": [
            { "name": "Miresen", "abbreviation": "Mir", "ordinal": 1 },
            { "name": "Grissen", "abbreviation": "Gri", "ordinal": 2 },
            { "name": "Whelsen", "abbreviation": "Whe", "ordinal": 3 },
            { "name": "Conthsen", "abbreviation": "Con", "ordinal": 4 },
            { "name": "Folsen", "abbreviation": "Fol", "ordinal": 5 },
            { "name": "Yulisen", "abbreviation": "Yul", "ordinal": 6, "isRestDay": true },
            { "name": "Da'leysen", "abbreviation": "Dal", "ordinal": 7, "isRestDay": true }
        ],
        "daysPerYear": 328,
        "hoursPerDay": 24,
        "minutesPerHour": 60,
        "secondsPerMinute": 60
    },
    "seasons": {
        "values": [
            { "name": "Spring", "monthStart": 3, "monthEnd": 5 },
            { "name": "Summer", "monthStart": 6, "monthEnd": 8 },
            { "name": "Autumn", "monthStart": 9, "monthEnd": 11 },
            { "name": "Winter", "monthStart": 1, "monthEnd": 2 }
        ]
    },
    "moons": {
        "values": [
            {
                "name": "Ruidus",
                "cycleLength": 29,
                "offset": 0
            },
            {
                "name": "Catha",
                "cycleLength": 30,
                "offset": 15
            }
        ]
    }
}

const DRAKKENHEIM = {
    "name": "Drakkenheim (Drakkenheim)",
    "id": "drakkenheim",
    "description": "The calendar used in the Drakkenheim setting, based on the Gregorian calendar with unique names for days and months.",
    "years": {
        "yearZero": 0,
        "firstWeekday": 0,
        "leapYear": {
            "leapStart": 8,
            "leapInterval": 4
        }
    },
    "months": {
        "values": [
            {
                "name": "Threshold",
                "abbreviation": "Thr",
                "ordinal": 1,
                "days": 31
            },
            {
                "name": "Thawing",
                "abbreviation": "Tha",
                "ordinal": 2,
                "days": 28,
                "leapDays": 29
            },
            {
                "name": "Springtide",
                "abbreviation": "Spr",
                "ordinal": 3,
                "days": 31
            },
            {
                "name": "Hearthstone",
                "abbreviation": "Hea",
                "ordinal": 4,
                "days": 30
            },
            {
                "name": "Sowing",
                "abbreviation": "Sow",
                "ordinal": 5,
                "days": 31
            },
            {
                "name": "Highsummer",
                "abbreviation": "Hig",
                "ordinal": 6,
                "days": 30
            },
            {
                "name": "Midyear",
                "abbreviation": "Mid",
                "ordinal": 7,
                "days": 31
            },
            {
                "name": "Sunbreak",
                "abbreviation": "Sun",
                "ordinal": 8,
                "days": 31
            },
            {
                "name": "Autumntide",
                "abbreviation": "Aut",
                "ordinal": 9,
                "days": 30
            },
            {
                "name": "Reaping",
                "abbreviation": "Rea",
                "ordinal": 10,
                "days": 31
            },
            {
                "name": "Rimewind",
                "abbreviation": "Rim",
                "ordinal": 11,
                "days": 30
            },
            {
                "name": "Midwinter",
                "abbreviation": "Miw",
                "ordinal": 12,
                "days": 31
            }
        ]
    },
    "days": {
        "values": [
            {
                "name": "Moonday",
                "abbreviation": "Mon",
                "ordinal": 1
            },
            {
                "name": "Tidesday",
                "abbreviation": "Tid",
                "ordinal": 2
            },
            {
                "name": "Windsday",
                "abbreviation": "Win",
                "ordinal": 3
            },
            {
                "name": "Earthsday",
                "abbreviation": "Tde",
                "ordinal": 4
            },
            {
                "name": "Fireday",
                "abbreviation": "Fir",
                "ordinal": 5
            },
            {
                "name": "Starsday",
                "abbreviation": "Sta",
                "ordinal": 6,
                "isRestDay": true
            },
            {
                "name": "Sunday",
                "abbreviation": "Sun",
                "ordinal": 7,
                "isRestDay": true
            }
        ],
        "daysPerYear": 365,
        "hoursPerDay": 24,
        "minutesPerHour": 60,
        "secondsPerMinute": 60
    },
    "seasons": {
        "values": [
            {
                "name": "Spring",
                "monthStart": 3,
                "monthEnd": 5
            },
            {
                "name": "Summer",
                "monthStart": 6,
                "monthEnd": 8
            },
            {
                "name": "Fall",
                "monthStart": 9,
                "monthEnd": 11
            },
            {
                "name": "Winter",
                "monthStart": 12,
                "monthEnd": 2
            }
        ]
    },
    "moons": {
        "values": [
            {
                "name": "Moon",
                "cycleLength": 30,
                "offset": 0
            }
        ]
    }
}

const IMPERIAL = {
    "name": "Imperial Calendar (Warhammer)",
    "id": "imperial",
    "description": "The Imperial Calendar of the Old World, featuring 12 months and a 8-day week. Includes the two moons, Mannslieb and the erratic Morrslieb.",
    "years": {
        "yearZero": 0,
        "firstWeekday": 0
    },
    "months": {
        "values": [
            { "name": "Hexenstag", "ordinal": 1, "days": 1 },
            { "name": "Nachexen", "ordinal": 1, "days": 32 },
            { "name": "Jahrdrung", "ordinal": 3, "days": 33 },
            { "name": "Mitterfruhl", "ordinal": 3, "days": 1 },
            { "name": "Pflugzeit", "ordinal": 4, "days": 33 },
            { "name": "Sigmarzeit", "ordinal": 5, "days": 33 },
            { "name": "Sommerzeit", "ordinal": 6, "days": 33 },
            { "name": "Sonnstill", "ordinal": 6, "days": 1 },
            { "name": "Vorgeheim", "ordinal": 7, "days": 33 },
            { "name": "Geheimstag", "ordinal": 7, "days": 1 },
            { "name": "Nachgeheim", "ordinal": 8, "days": 32 },
            { "name": "Erntezeit", "ordinal": 8, "days": 33 },
            { "name": "Mittherbst", "ordinal": 8, "days": 1 },
            { "name": "Brauzeit", "ordinal": 9, "days": 33 },
            { "name": "Kaldzeit", "ordinal": 10, "days": 33 },
            { "name": "Ulriczeit", "ordinal": 11, "days": 33 },
            { "name": "Monstille", "ordinal": 11, "days": 1 },
            { "name": "Vorhexen", "ordinal": 12, "days": 33 }
        ]
    },
    "days": {
        "values": [
            { "name": "Wellentag", "ordinal": 1 },
            { "name": "Aubentag", "ordinal": 2 },
            { "name": "Marktag", "ordinal": 3 },
            { "name": "Backertag", "ordinal": 4 },
            { "name": "Bezahltag", "ordinal": 5 },
            { "name": "Konistag", "ordinal": 6 },
            { "name": "Angestag", "ordinal": 7 },
            { "name": "Festag", "ordinal": 8 }
        ],
        "daysPerYear": 400,
        "hoursPerDay": 24,
        "minutesPerHour": 60,
        "secondsPerMinute": 60
    },
    "seasons": {
        "values": [
            {
                "name": "Spring",
                "dayStart": 19,
                "dayEnd": 118
            },
            {
                "name": "Summer",
                "dayStart": 118,
                "dayEnd": 218
            },
            {
                "name": "Autumn",
                "dayStart": 218,
                "dayEnd": 318
            },
            {
                "name": "Winter",
                "dayStart": 318,
                "dayEnd": 19
            }
        ]
    },
    "moons": {
        "values": [
            {
                "name": "Mannslieb",
                "cycleLength": 25,
                "offset": 0
            },
            {
                "name": "Morrslieb",
                "cycleLength": 15,
                "offset": 0
            }
        ]
    }
}

const FORBIDDEN_LANDS = {
    "name": "Forbidden Lands Calendar",
    "id": "forbiddenlands",
    "description": "The human celandar of the Forbidden Lands. Eight seasons with a seven day week and a moon.",
    "years": {
        "yearZero": 0,
        "firstWeekday": 0
    },
    "months": {
        "values": [
            { "name": "Springrise", "ordinal": 1, "days": 45 },
            { "name": "Springwane", "ordinal": 2, "days": 46 },
            { "name": "Summerrise", "ordinal": 3, "days": 46 },
            { "name": "Summerwane", "ordinal": 4, "days": 46 },
            { "name": "Fallrise", "ordinal": 5, "days": 45 },
            { "name": "Fallwane", "ordinal": 6, "days": 46 },
            { "name": "Winterrise", "ordinal": 7, "days": 45 },
            { "name": "Winterwane", "ordinal": 8, "days": 46 }
        ]
    },
    "days": {
        "values": [
            { "name": "Sunday", "ordinal": 1 },
            { "name": "Moonday", "ordinal": 2 },
            { "name": "Bloodday", "ordinal": 3 },
            { "name": "Earthday", "ordinal": 4 },
            { "name": "Growthday", "ordinal": 5 },
            { "name": "Feastday", "ordinal": 6 },
            { "name": "Stillday", "ordinal": 6 }
        ],
        "daysPerYear": 365,
        "hoursPerDay": 24,
        "minutesPerHour": 60,
        "secondsPerMinute": 60
    },
    "seasons": {
        "values": [
            { "name": "Spring", "monthStart": 1, "monthEnd": 2 },
            { "name": "Summer", "monthStart": 3, "monthEnd": 4 },
            { "name": "Fall", "monthStart": 5, "monthEnd": 6 },
            { "name": "Winter", "monthStart": 7, "monthEnd": 8 }
        ]
    },
    "moons": {
        "values": [
            {
                "name": "Nightwalker",
                "cycleLength": 28,
                "offset": 0
            }
        ]
    }
}

const calendars = [HARPTOS, BAROVIAN, GALIFAR, GOLARION, THYATIAN, COMMONYEAR, ATHASIAN, CERILIAN, EXANDRIAN, DRAKKENHEIM, IMPERIAL, FORBIDDEN_LANDS, DRAG_SOLAMNIA, DRAG_ELVEN, GREGORIAN]

calendars.forEach(json => {
    const daysInYear = json.months.values.reduce((acc, v) => acc += v.days, 0);
    const daysInYearJson = json.days.daysPerYear;
    if (daysInYear !== daysInYearJson) {
        console.error("Wrong days for calendar " + json.name + ". Set days in year to " + daysInYear)
    }
    if (!json.id) {
        console.error("Missing id for calendar " + json.name)
    }
    if (!json.seasons) {
        json.seasons = {
            values: [
                {
                    "name": "Missing Seasons",
                    "monthStart": 0,
                    "monthEnd": 999
                },
            ]
        }
    }
})

export const CALENDARS = [
    ...calendars.sort((a, b) => a.name.localeCompare(b.name))
]