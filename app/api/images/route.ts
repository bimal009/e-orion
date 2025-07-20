import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Dummy data for bulk insertion
const dummyTeams = [
  {
    name: "Crimson Hawks",
    tournamentId: "687a5e3e1fb189b08cfb5b3f",
    logo: "https://source.unsplash.com/random/200x200?hawk",
    teamTag: "CHW",
    email: "contact@crimsonhawks.gg",
    phone: "+1-555-1000",
    players: {
      create: [
        {
          name: "Alice Morgan",
          ign: "RedWing",
          role: "Captain",
          image: "https://source.unsplash.com/random/200x200?woman&1",
          email: "alice@crimsonhawks.gg",
          phone: "+1-555-1001",
        },
        {
          name: "Brian Lee",
          ign: "Swoop",
          role: "Support",
          image: "https://source.unsplash.com/random/200x200?man&1",
          email: "brian@crimsonhawks.gg",
          phone: "+1-555-1002",
        },
        {
          name: "Chloe Patel",
          ign: "Talon",
          role: "DPS",
          image: "https://source.unsplash.com/random/200x200?gamer&1",
          email: "chloe@crimsonhawks.gg",
          phone: "+1-555-1003",
        },
      ],
    },
  },
  {
    name: "Azure Eagles",
    tournamentId: "687a5e3e1fb189b08cfb5b3f",
    logo: "https://source.unsplash.com/random/200x200?eagle",
    teamTag: "AEG",
    email: "contact@azureeagles.gg",
    phone: "+1-555-2000",
    players: {
      create: [
        {
          name: "David Kim",
          ign: "SkyLord",
          role: "Captain",
          image: "https://source.unsplash.com/random/200x200?man&2",
          email: "david@azureeagles.gg",
          phone: "+1-555-2001",
        },
        {
          name: "Emma Johnson",
          ign: "CloudStr",
          role: "Support",
          image: "https://source.unsplash.com/random/200x200?woman&2",
          email: "emma@azureeagles.gg",
          phone: "+1-555-2002",
        },
        {
          name: "Frank Miller",
          ign: "Thunder",
          role: "DPS",
          image: "https://source.unsplash.com/random/200x200?gamer&2",
          email: "frank@azureeagles.gg",
          phone: "+1-555-2003",
        },
      ],
    },
  },
  {
    name: "Golden Lions",
    tournamentId: "687a5e3e1fb189b08cfb5b3f",
    logo: "https://source.unsplash.com/random/200x200?lion",
    teamTag: "GLI",
    email: "contact@goldenlions.gg",
    phone: "+1-555-3000",
    players: {
      create: [
        {
          name: "Grace Williams",
          ign: "Mufasa",
          role: "Captain",
          image: "https://source.unsplash.com/random/200x200?woman&3",
          email: "grace@goldenlions.gg",
          phone: "+1-555-3001",
        },
        {
          name: "Henry Brown",
          ign: "Simba",
          role: "Support",
          image: "https://source.unsplash.com/random/200x200?man&3",
          email: "henry@goldenlions.gg",
          phone: "+1-555-3002",
        },
        {
          name: "Ivy Davis",
          ign: "Nala",
          role: "DPS",
          image: "https://source.unsplash.com/random/200x200?gamer&3",
          email: "ivy@goldenlions.gg",
          phone: "+1-555-3003",
        },
      ],
    },
  },
  {
    name: "Emerald Tigers",
    tournamentId: "687a5e3e1fb189b08cfb5b3f",
    logo: "https://source.unsplash.com/random/200x200?tiger",
    teamTag: "ETI",
    email: "contact@emeraldtigers.gg",
    phone: "+1-555-4000",
    players: {
      create: [
        {
          name: "Jack Wilson",
          ign: "Stripe",
          role: "Captain",
          image: "https://source.unsplash.com/random/200x200?man&4",
          email: "jack@emeraldtigers.gg",
          phone: "+1-555-4001",
        },
        {
          name: "Kate Martinez",
          ign: "Claw",
          role: "Support",
          image: "https://source.unsplash.com/random/200x200?woman&4",
          email: "kate@emeraldtigers.gg",
          phone: "+1-555-4002",
        },
        {
          name: "Leo Anderson",
          ign: "Fang",
          role: "DPS",
          image: "https://source.unsplash.com/random/200x200?gamer&4",
          email: "leo@emeraldtigers.gg",
          phone: "+1-555-4003",
        },
      ],
    },
  },
  {
    name: "Sapphire Wolves",
    tournamentId: "687a5e3e1fb189b08cfb5b3f",
    logo: "https://source.unsplash.com/random/200x200?wolf",
    teamTag: "SWO",
    email: "contact@sapphirewolves.gg",
    phone: "+1-555-5000",
    players: {
      create: [
        {
          name: "Mia Taylor",
          ign: "Luna",
          role: "Captain",
          image: "https://source.unsplash.com/random/200x200?woman&5",
          email: "mia@sapphirewolves.gg",
          phone: "+1-555-5001",
        },
        {
          name: "Noah Thomas",
          ign: "Alpha",
          role: "Support",
          image: "https://source.unsplash.com/random/200x200?man&5",
          email: "noah@sapphirewolves.gg",
          phone: "+1-555-5002",
        },
        {
          name: "Olivia Jackson",
          ign: "Howler",
          role: "DPS",
          image: "https://source.unsplash.com/random/200x200?gamer&5",
          email: "olivia@sapphirewolves.gg",
          phone: "+1-555-5003",
        },
      ],
    },
  },
  {
    name: "Ruby Bears",
    tournamentId: "687a5e3e1fb189b08cfb5b3f",
    logo: "https://source.unsplash.com/random/200x200?bear",
    teamTag: "RBE",
    email: "contact@rubybears.gg",
    phone: "+1-555-6000",
    players: {
      create: [
        {
          name: "Peter White",
          ign: "Grizzly",
          role: "Captain",
          image: "https://source.unsplash.com/random/200x200?man&6",
          email: "peter@rubybears.gg",
          phone: "+1-555-6001",
        },
        {
          name: "Quinn Harris",
          ign: "Koda",
          role: "Support",
          image: "https://source.unsplash.com/random/200x200?woman&6",
          email: "quinn@rubybears.gg",
          phone: "+1-555-6002",
        },
        {
          name: "Rose Clark",
          ign: "Honey",
          role: "DPS",
          image: "https://source.unsplash.com/random/200x200?gamer&6",
          email: "rose@rubybears.gg",
          phone: "+1-555-6003",
        },
      ],
    },
  },
  {
    name: "Diamond Sharks",
    tournamentId: "687a5e3e1fb189b08cfb5b3f",
    logo: "https://source.unsplash.com/random/200x200?shark",
    teamTag: "DSH",
    email: "contact@diamondsharks.gg",
    phone: "+1-555-7000",
    players: {
      create: [
        {
          name: "Sam Lewis",
          ign: "Jaws",
          role: "Captain",
          image: "https://source.unsplash.com/random/200x200?man&7",
          email: "sam@diamondsharks.gg",
          phone: "+1-555-7001",
        },
        {
          name: "Tina Young",
          ign: "Fin",
          role: "Support",
          image: "https://source.unsplash.com/random/200x200?woman&7",
          email: "tina@diamondsharks.gg",
          phone: "+1-555-7002",
        },
        {
          name: "Uma Allen",
          ign: "Razor",
          role: "DPS",
          image: "https://source.unsplash.com/random/200x200?gamer&7",
          email: "uma@diamondsharks.gg",
          phone: "+1-555-7003",
        },
      ],
    },
  },
  {
    name: "Platinum Dragons",
    tournamentId: "687a5e3e1fb189b08cfb5b3f",
    logo: "https://source.unsplash.com/random/200x200?dragon",
    teamTag: "PDR",
    email: "contact@platinumdragons.gg",
    phone: "+1-555-8000",
    players: {
      create: [
        {
          name: "Victor King",
          ign: "Drogon",
          role: "Captain",
          image: "https://source.unsplash.com/random/200x200?man&8",
          email: "victor@platinumdragons.gg",
          phone: "+1-555-8001",
        },
        {
          name: "Wendy Wright",
          ign: "Smaug",
          role: "Support",
          image: "https://source.unsplash.com/random/200x200?woman&8",
          email: "wendy@platinumdragons.gg",
          phone: "+1-555-8002",
        },
        {
          name: "Xander Scott",
          ign: "Spyro",
          role: "DPS",
          image: "https://source.unsplash.com/random/200x200?gamer&8",
          email: "xander@platinumdragons.gg",
          phone: "+1-555-8003",
        },
      ],
    },
  },
  {
    name: "Silver Phoenixes",
    tournamentId: "687a5e3e1fb189b08cfb5b3f",
    logo: "https://source.unsplash.com/random/200x200?phoenix",
    teamTag: "SPH",
    email: "contact@silverphoenixes.gg",
    phone: "+1-555-9000",
    players: {
      create: [
        {
          name: "Yara Green",
          ign: "Fawkes",
          role: "Captain",
          image: "https://source.unsplash.com/random/200x200?woman&9",
          email: "yara@silverphoenixes.gg",
          phone: "+1-555-9001",
        },
        {
          name: "Zack Baker",
          ign: "Ember",
          role: "Support",
          image: "https://source.unsplash.com/random/200x200?man&9",
          email: "zack@silverphoenixes.gg",
          phone: "+1-555-9002",
        },
        {
          name: "Anna Adams",
          ign: "Ash",
          role: "DPS",
          image: "https://source.unsplash.com/random/200x200?gamer&9",
          email: "anna@silverphoenixes.gg",
          phone: "+1-555-9003",
        },
      ],
    },
  },
  {
    name: "Bronze Falcons",
    tournamentId: "687a5e3e1fb189b08cfb5b3f",
    logo: "https://source.unsplash.com/random/200x200?falcon",
    teamTag: "BFA",
    email: "contact@bronzefalcons.gg",
    phone: "+1-555-1100",
    players: {
      create: [
        {
          name: "Bella Nelson",
          ign: "Skye",
          role: "Captain",
          image: "https://source.unsplash.com/random/200x200?woman&10",
          email: "bella@bronzefalcons.gg",
          phone: "+1-555-1101",
        },
        {
          name: "Cody Hill",
          ign: "Raptor",
          role: "Support",
          image: "https://source.unsplash.com/random/200x200?man&10",
          email: "cody@bronzefalcons.gg",
          phone: "+1-555-1102",
        },
        {
          name: "Dylan Baker",
          ign: "Talos",
          role: "DPS",
          image: "https://source.unsplash.com/random/200x200?gamer&10",
          email: "dylan@bronzefalcons.gg",
          phone: "+1-555-1103",
        },
      ],
    },
  },
  {
    name: "Obsidian Panthers",
    tournamentId: "687a5e3e1fb189b08cfb5b3f",
    logo: "https://source.unsplash.com/random/200x200?panther",
    teamTag: "OPA",
    email: "contact@obsidianpanthers.gg",
    phone: "+1-555-1200",
    players: {
      create: [
        {
          name: "Ethan Carter",
          ign: "Shadow",
          role: "Captain",
          image: "https://source.unsplash.com/random/200x200?man&11",
          email: "ethan@obsidianpanthers.gg",
          phone: "+1-555-1201",
        },
        {
          name: "Faith Parker",
          ign: "Midnight",
          role: "Support",
          image: "https://source.unsplash.com/random/200x200?woman&11",
          email: "faith@obsidianpanthers.gg",
          phone: "+1-555-1202",
        },
        {
          name: "Gabe Evans",
          ign: "Stealth",
          role: "DPS",
          image: "https://source.unsplash.com/random/200x200?gamer&11",
          email: "gabe@obsidianpanthers.gg",
          phone: "+1-555-1203",
        },
      ],
    },
  },
  {
    name: "Jade Jaguars",
    tournamentId: "687a5e3e1fb189b08cfb5b3f",
    logo: "https://source.unsplash.com/random/200x200?jaguar",
    teamTag: "JJA",
    email: "contact@jadejaguars.gg",
    phone: "+1-555-1300",
    players: {
      create: [
        {
          name: "Hannah Reed",
          ign: "Spots",
          role: "Captain",
          image: "https://source.unsplash.com/random/200x200?woman&12",
          email: "hannah@jadejaguars.gg",
          phone: "+1-555-1301",
        },
        {
          name: "Ian Collins",
          ign: "Jungle",
          role: "Support",
          image: "https://source.unsplash.com/random/200x200?man&12",
          email: "ian@jadejaguars.gg",
          phone: "+1-555-1302",
        },
        {
          name: "Julia Bell",
          ign: "Prowler",
          role: "DPS",
          image: "https://source.unsplash.com/random/200x200?gamer&12",
          email: "julia@jadejaguars.gg",
          phone: "+1-555-1303",
        },
      ],
    },
  },
  {
    name: "Topaz Leopards",
    tournamentId: "687a5e3e1fb189b08cfb5b3f",
    logo: "https://source.unsplash.com/random/200x200?leopard",
    teamTag: "TLE",
    email: "contact@topazleopards.gg",
    phone: "+1-555-1400",
    players: {
      create: [
        {
          name: "Kevin Murphy",
          ign: "Spot",
          role: "Captain",
          image: "https://source.unsplash.com/random/200x200?man&13",
          email: "kevin@topazleopards.gg",
          phone: "+1-555-1401",
        },
        {
          name: "Lily Watson",
          ign: "Savannah",
          role: "Support",
          image: "https://source.unsplash.com/random/200x200?woman&13",
          email: "lily@topazleopards.gg",
          phone: "+1-555-1402",
        },
        {
          name: "Max Powell",
          ign: "Climber",
          role: "DPS",
          image: "https://source.unsplash.com/random/200x200?gamer&13",
          email: "max@topazleopards.gg",
          phone: "+1-555-1403",
        },
      ],
    },
  },
  {
    name: "Amber Cheetahs",
    tournamentId: "687a5e3e1fb189b08cfb5b3f",
    logo: "https://source.unsplash.com/random/200x200?cheetah",
    teamTag: "ACH",
    email: "contact@ambercheetahs.gg",
    phone: "+1-555-1500",
    players: {
      create: [
        {
          name: "Nora Hughes",
          ign: "Speed",
          role: "Captain",
          image: "https://source.unsplash.com/random/200x200?woman&14",
          email: "nora@ambercheetahs.gg",
          phone: "+1-555-1501",
        },
        {
          name: "Owen Bryant",
          ign: "Flash",
          role: "Support",
          image: "https://source.unsplash.com/random/200x200?man&14",
          email: "owen@ambercheetahs.gg",
          phone: "+1-555-1502",
        },
        {
          name: "Paige Alexander",
          ign: "Sprint",
          role: "DPS",
          image: "https://source.unsplash.com/random/200x200?gamer&14",
          email: "paige@ambercheetahs.gg",
          phone: "+1-555-1503",
        },
      ],
    },
  },
  {
    name: "Onyx Pumas",
    tournamentId: "687a5e3e1fb189b08cfb5b3f",
    logo: "https://source.unsplash.com/random/200x200?puma",
    teamTag: "OPU",
    email: "contact@onyxpumas.gg",
    phone: "+1-555-1600",
    players: {
      create: [
        {
          name: "Quentin Russell",
          ign: "Ghost",
          role: "Captain",
          image: "https://source.unsplash.com/random/200x200?man&15",
          email: "quentin@onyxpumas.gg",
          phone: "+1-555-1601",
        },
        {
          name: "Rachel Griffin",
          ign: "Spirit",
          role: "Support",
          image: "https://source.unsplash.com/random/200x200?woman&15",
          email: "rachel@onyxpumas.gg",
          phone: "+1-555-1602",
        },
        {
          name: "Steve Foster",
          ign: "Mountain",
          role: "DPS",
          image: "https://source.unsplash.com/random/200x200?gamer&15",
          email: "steve@onyxpumas.gg",
          phone: "+1-555-1603",
        },
      ],
    },
  },
  {
    name: "Ivory Cobras",
    tournamentId: "687a5e3e1fb189b08cfb5b3f",
    logo: "https://source.unsplash.com/random/200x200?cobra",
    teamTag: "ICO",
    email: "contact@ivorycobras.gg",
    phone: "+1-555-1700",
    players: {
      create: [
        {
          name: "Tara Simmons",
          ign: "Viper",
          role: "Captain",
          image: "https://source.unsplash.com/random/200x200?woman&16",
          email: "tara@ivorycobras.gg",
          phone: "+1-555-1701",
        },
        {
          name: "Uriel Perry",
          ign: "Hood",
          role: "Support",
          image: "https://source.unsplash.com/random/200x200?man&16",
          email: "uriel@ivorycobras.gg",
          phone: "+1-555-1702",
        },
        {
          name: "Vivian Long",
          ign: "Strike",
          role: "DPS",
          image: "https://source.unsplash.com/random/200x200?gamer&16",
          email: "vivian@ivorycobras.gg",
          phone: "+1-555-1703",
        },
      ],
    },
  },
  {
    name: "Scarlet Vipers",
    tournamentId: "687a5e3e1fb189b08cfb5b3f",
    logo: "https://source.unsplash.com/random/200x200?viper",
    teamTag: "SVI",
    email: "contact@scarletvipers.gg",
    phone: "+1-555-1800",
    players: {
      create: [
        {
          name: "Wade Coleman",
          ign: "Fangs",
          role: "Captain",
          image: "https://source.unsplash.com/random/200x200?man&17",
          email: "wade@scarletvipers.gg",
          phone: "+1-555-1801",
        },
        {
          name: "Xena Barnes",
          ign: "Venom",
          role: "Support",
          image: "https://source.unsplash.com/random/200x200?woman&17",
          email: "xena@scarletvipers.gg",
          phone: "+1-555-1802",
        },
        {
          name: "Yosef Fisher",
          ign: "Hiss",
          role: "DPS",
          image: "https://source.unsplash.com/random/200x200?gamer&17",
          email: "yosef@scarletvipers.gg",
          phone: "+1-555-1803",
        },
      ],
    },
  },
  {
    name: "Violet Scorpions",
    tournamentId: "687a5e3e1fb189b08cfb5b3f",
    logo: "https://source.unsplash.com/random/200x200?scorpion",
    teamTag: "VSC",
    email: "contact@violetscorpions.gg",
    phone: "+1-555-1900",
    players: {
      create: [
        {
          name: "Zara Henderson",
          ign: "Stinger",
          role: "Captain",
          image: "https://source.unsplash.com/random/200x200?woman&18",
          email: "zara@violetscorpions.gg",
          phone: "+1-555-1901",
        },
        {
          name: "Aaron Sanders",
          ign: "Pincer",
          role: "Support",
          image: "https://source.unsplash.com/random/200x200?man&18",
          email: "aaron@violetscorpions.gg",
          phone: "+1-555-1902",
        },
        {
          name: "Brianna Curtis",
          ign: "Arachnid",
          role: "DPS",
          image: "https://source.unsplash.com/random/200x200?gamer&18",
          email: "brianna@violetscorpions.gg",
          phone: "+1-555-1903",
        },
      ],
    },
  },
  {
    name: "Indigo Raptors",
    tournamentId: "687a5e3e1fb189b08cfb5b3f",
    logo: "https://source.unsplash.com/random/200x200?raptor",
    teamTag: "IRA",
    email: "contact@indigoraptors.gg",
    phone: "+1-555-2100",
    players: {
      create: [
        {
          name: "Carter Pearson",
          ign: "Veloci",
          role: "Captain",
          image: "https://source.unsplash.com/random/200x200?man&19",
          email: "carter@indigoraptors.gg",
          phone: "+1-555-2101",
        },
        {
          name: "Diana Harper",
          ign: "RaptorX",
          role: "Support",
          image: "https://source.unsplash.com/random/200x200?woman&19",
          email: "diana@indigoraptors.gg",
          phone: "+1-555-2102",
        },
        {
          name: "Eli George",
          ign: "Clever",
          role: "DPS",
          image: "https://source.unsplash.com/random/200x200?gamer&19",
          email: "eli@indigoraptors.gg",
          phone: "+1-555-2103",
        },
      ],
    },
  },
  {
    name: "Magenta Hornets",
    tournamentId: "687a5e3e1fb189b08cfb5b3f",
    logo: "https://source.unsplash.com/random/200x200?hornet",
    teamTag: "MHO",
    email: "contact@magentahornets.gg",
    phone: "+1-555-2200",
    players: {
      create: [
        {
          name: "Fiona West",
          ign: "Buzzer",
          role: "Captain",
          image: "https://source.unsplash.com/random/200x200?woman&20",
          email: "fiona@magentahornets.gg",
          phone: "+1-555-2201",
        },
        {
          name: "Gavin Lynch",
          ign: "Swarm",
          role: "Support",
          image: "https://source.unsplash.com/random/200x200?man&20",
          email: "gavin@magentahornets.gg",
          phone: "+1-555-2202",
        },
        {
          name: "Holly Berry",
          ign: "Sting",
          role: "DPS",
          image: "https://source.unsplash.com/random/200x200?gamer&20",
          email: "holly@magentahornets.gg",
          phone: "+1-555-2203",
        },
      ],
    },
  },
];

export const GET = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Use dummyTeams for insertion
    console.log("inserting teams")
    const createdTeams = [];
    for (const team of dummyTeams) {
      const created = await prisma.team.create({
        data: {
          name: team.name,
          tournamentId: team.tournamentId,
          logo: team.logo || null,
          teamTag: team.teamTag ?? null,
          email: team.email || null,
          phone: team.phone || null,
          players: team.players?.create
            ? {
                create: team.players.create.map((player: any) => ({
                  name: player.name,
                  ign: player.ign,
                  role: player.role || null,
                  image: player.image || null,
                  email: player.email || null,
                  phone: player.phone || null,
                })),
              }
            : undefined,
        },
        include: {
          tournament: true,
          players: true,
          round: true,
        },
      });
      console.log("created team", created)
      createdTeams.push(created);
    }
    return NextResponse.json(createdTeams, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create teams" }, { status: 500 });
  }
};