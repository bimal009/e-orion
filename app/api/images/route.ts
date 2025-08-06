import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Dummy data for bulk insertion
const dummyTeams = [
  {
    name: "Crimson Hawks",
    tournamentId: "687d23940670f4d304279292",
    logo: "https://avatar.iran.liara.run/public/13.png",
    teamTag: "CHW",
    email: "contact@crimsonhawks.gg",
    phone: "+1-555-1000",
    players: {
      create: [
        {
          name: "Alice Morgan",
          ign: "RedWing",
          role: "Captain",
          image: "https://avatar.iran.liara.run/public/14.png",
          email: "alice@crimsonhawks.gg",
          phone: "+1-555-1001",
        },
        {
          name: "Brian Lee",
          ign: "Swoop",
          role: "Support",
          image: "https://avatar.iran.liara.run/public/15.png",
          email: "brian@crimsonhawks.gg",
          phone: "+1-555-1002",
        },
        {
          name: "Chloe Patel",
          ign: "Talon",
          role: "DPS",
          image: "https://avatar.iran.liara.run/public/16.png",
          email: "chloe@crimsonhawks.gg",
          phone: "+1-555-1003",
        },
      ],
    },
  },
  {
    name: "Azure Eagles",
    tournamentId: "687d23940670f4d304279292",
    logo: "https://avatar.iran.liara.run/public/17.png",
    teamTag: "AEG",
    email: "contact@azureeagles.gg",
    phone: "+1-555-2000",
    players: {
      create: [
        {
          name: "David Kim",
          ign: "SkyLord",
          role: "Captain",
          image: "https://avatar.iran.liara.run/public/18.png",
          email: "david@azureeagles.gg",
          phone: "+1-555-2001",
        },
        {
          name: "Emma Johnson",
          ign: "CloudStr",
          role: "Support",
          image: "https://avatar.iran.liara.run/public/19.png",
          email: "emma@azureeagles.gg",
          phone: "+1-555-2002",
        },
        {
          name: "Frank Miller",
          ign: "Thunder",
          role: "DPS",
          image: "https://avatar.iran.liara.run/public/20.png",
          email: "frank@azureeagles.gg",
          phone: "+1-555-2003",
        },
      ],
    },
  },
  {
    name: "Golden Lions",
    tournamentId: "687d23940670f4d304279292",
    logo: "https://avatar.iran.liara.run/public/21.png",
    teamTag: "GLI",
    email: "contact@goldenlions.gg",
    phone: "+1-555-3000",
    players: {
      create: [
        {
          name: "Grace Williams",
          ign: "Mufasa",
          role: "Captain",
          image: "https://avatar.iran.liara.run/public/22.png",
          email: "grace@goldenlions.gg",
          phone: "+1-555-3001",
        },
        {
          name: "Henry Brown",
          ign: "Simba",
          role: "Support",
          image: "https://avatar.iran.liara.run/public/23.png",
          email: "henry@goldenlions.gg",
          phone: "+1-555-3002",
        },
        {
          name: "Ivy Davis",
          ign: "Nala",
          role: "DPS",
          image: "https://avatar.iran.liara.run/public/24.png",
          email: "ivy@goldenlions.gg",
          phone: "+1-555-3003",
        },
      ],
    },
  },
  {
    name: "Emerald Tigers",
    tournamentId: "687d23940670f4d304279292",
    logo: "https://avatar.iran.liara.run/public/25.png",
    teamTag: "ETI",
    email: "contact@emeraldtigers.gg",
    phone: "+1-555-4000",
    players: {
      create: [
        {
          name: "Jack Wilson",
          ign: "Stripe",
          role: "Captain",
          image: "https://avatar.iran.liara.run/public/26.png",
          email: "jack@emeraldtigers.gg",
          phone: "+1-555-4001",
        },
        {
          name: "Kate Martinez",
          ign: "Claw",
          role: "Support",
          image: "https://avatar.iran.liara.run/public/27.png",
          email: "kate@emeraldtigers.gg",
          phone: "+1-555-4002",
        },
        {
          name: "Leo Anderson",
          ign: "Fang",
          role: "DPS",
          image: "https://avatar.iran.liara.run/public/28.png",
          email: "leo@emeraldtigers.gg",
          phone: "+1-555-4003",
        },
      ],
    },
  },
  {
    name: "Sapphire Wolves",
    tournamentId: "687d23940670f4d304279292",
    logo: "https://avatar.iran.liara.run/public/29.png",
    teamTag: "SWO",
    email: "contact@sapphirewolves.gg",
    phone: "+1-555-5000",
    players: {
      create: [
        {
          name: "Mia Taylor",
          ign: "Luna",
          role: "Captain",
          image: "https://avatar.iran.liara.run/public/30.png",
          email: "mia@sapphirewolves.gg",
          phone: "+1-555-5001",
        },
        {
          name: "Noah Thomas",
          ign: "Alpha",
          role: "Support",
          image: "https://avatar.iran.liara.run/public/31.png",
          email: "noah@sapphirewolves.gg",
          phone: "+1-555-5002",
        },
        {
          name: "Olivia Jackson",
          ign: "Howler",
          role: "DPS",
          image: "https://avatar.iran.liara.run/public/32.png",
          email: "olivia@sapphirewolves.gg",
          phone: "+1-555-5003",
        },
      ],
    },
  },
  {
    name: "Ruby Bears",
    tournamentId: "687d23940670f4d304279292",
    logo: "https://avatar.iran.liara.run/public/33.png",
    teamTag: "RBE",
    email: "contact@rubybears.gg",
    phone: "+1-555-6000",
    players: {
      create: [
        {
          name: "Peter White",
          ign: "Grizzly",
          role: "Captain",
          image: "https://avatar.iran.liara.run/public/34.png",
          email: "peter@rubybears.gg",
          phone: "+1-555-6001",
        },
        {
          name: "Quinn Harris",
          ign: "Koda",
          role: "Support",
          image: "https://avatar.iran.liara.run/public/35.png",
          email: "quinn@rubybears.gg",
          phone: "+1-555-6002",
        },
        {
          name: "Rose Clark",
          ign: "Honey",
          role: "DPS",
          image: "https://avatar.iran.liara.run/public/36.png",
          email: "rose@rubybears.gg",
          phone: "+1-555-6003",
        },
      ],
    },
  },
  {
    name: "Diamond Sharks",
    tournamentId: "687d23940670f4d304279292",
    logo: "https://avatar.iran.liara.run/public/37.png",
    teamTag: "DSH",
    email: "contact@diamondsharks.gg",
    phone: "+1-555-7000",
    players: {
      create: [
        {
          name: "Sam Lewis",
          ign: "Jaws",
          role: "Captain",
          image: "https://avatar.iran.liara.run/public/38.png",
          email: "sam@diamondsharks.gg",
          phone: "+1-555-7001",
        },
        {
          name: "Tina Young",
          ign: "Fin",
          role: "Support",
          image: "https://avatar.iran.liara.run/public/39.png",
          email: "tina@diamondsharks.gg",
          phone: "+1-555-7002",
        },
        {
          name: "Uma Allen",
          ign: "Razor",
          role: "DPS",
          image: "https://avatar.iran.liara.run/public/40.png",
          email: "uma@diamondsharks.gg",
          phone: "+1-555-7003",
        },
      ],
    },
  },
  {
    name: "Platinum Dragons",
    tournamentId: "687d23940670f4d304279292",
    logo: "https://avatar.iran.liara.run/public/41.png",
    teamTag: "PDR",
    email: "contact@platinumdragons.gg",
    phone: "+1-555-8000",
    players: {
      create: [
        {
          name: "Victor King",
          ign: "Drogon",
          role: "Captain",
          image: "https://avatar.iran.liara.run/public/42.png",
          email: "victor@platinumdragons.gg",
          phone: "+1-555-8001",
        },
        {
          name: "Wendy Wright",
          ign: "Smaug",
          role: "Support",
          image: "https://avatar.iran.liara.run/public/43.png",
          email: "wendy@platinumdragons.gg",
          phone: "+1-555-8002",
        },
        {
          name: "Xander Scott",
          ign: "Spyro",
          role: "DPS",
          image: "https://avatar.iran.liara.run/public/44.png",
          email: "xander@platinumdragons.gg",
          phone: "+1-555-8003",
        },
      ],
    },
  },
  {
    name: "Silver Phoenixes",
    tournamentId: "687d23940670f4d304279292",
    logo: "https://avatar.iran.liara.run/public/45.png",
    teamTag: "SPH",
    email: "contact@silverphoenixes.gg",
    phone: "+1-555-9000",
    players: {
      create: [
        {
          name: "Yara Green",
          ign: "Fawkes",
          role: "Captain",
          image: "https://avatar.iran.liara.run/public/46.png",
          email: "yara@silverphoenixes.gg",
          phone: "+1-555-9001",
        },
        {
          name: "Zack Baker",
          ign: "Ember",
          role: "Support",
          image: "https://avatar.iran.liara.run/public/47.png",
          email: "zack@silverphoenixes.gg",
          phone: "+1-555-9002",
        },
        {
          name: "Anna Adams",
          ign: "Ash",
          role: "DPS",
          image: "https://avatar.iran.liara.run/public/48.png",
          email: "anna@silverphoenixes.gg",
          phone: "+1-555-9003",
        },
      ],
    },
  },
  {
    name: "Bronze Falcons",
    tournamentId: "687d23940670f4d304279292",
    logo: "https://avatar.iran.liara.run/public/49.png",
    teamTag: "BFA",
    email: "contact@bronzefalcons.gg",
    phone: "+1-555-1100",
    players: {
      create: [
        {
          name: "Bella Nelson",
          ign: "Skye",
          role: "Captain",
          image: "https://avatar.iran.liara.run/public/50.png",
          email: "bella@bronzefalcons.gg",
          phone: "+1-555-1101",
        },
        {
          name: "Cody Hill",
          ign: "Raptor",
          role: "Support",
          image: "https://avatar.iran.liara.run/public/51.png",
          email: "cody@bronzefalcons.gg",
          phone: "+1-555-1102",
        },
        {
          name: "Dylan Baker",
          ign: "Talos",
          role: "DPS",
          image: "https://avatar.iran.liara.run/public/52.png",
          email: "dylan@bronzefalcons.gg",
          phone: "+1-555-1103",
        },
      ],
    },
  },
  {
    name: "Obsidian Panthers",
    tournamentId: "687d23940670f4d304279292",
    logo: "https://avatar.iran.liara.run/public/53.png",
    teamTag: "OPA",
    email: "contact@obsidianpanthers.gg",
    phone: "+1-555-1200",
    players: {
      create: [
        {
          name: "Ethan Carter",
          ign: "Shadow",
          role: "Captain",
          image: "https://avatar.iran.liara.run/public/54.png",
          email: "ethan@obsidianpanthers.gg",
          phone: "+1-555-1201",
        },
        {
          name: "Faith Parker",
          ign: "Midnight",
          role: "Support",
          image: "https://avatar.iran.liara.run/public/55.png",
          email: "faith@obsidianpanthers.gg",
          phone: "+1-555-1202",
        },
        {
          name: "Gabe Evans",
          ign: "Stealth",
          role: "DPS",
          image: "https://avatar.iran.liara.run/public/56.png",
          email: "gabe@obsidianpanthers.gg",
          phone: "+1-555-1203",
        },
      ],
    },
  },
  {
    name: "Jade Jaguars",
    tournamentId: "687d23940670f4d304279292",
    logo: "https://avatar.iran.liara.run/public/57.png",
    teamTag: "JJA",
    email: "contact@jadejaguars.gg",
    phone: "+1-555-1300",
    players: {
      create: [
        {
          name: "Hannah Reed",
          ign: "Spots",
          role: "Captain",
          image: "https://avatar.iran.liara.run/public/58.png",
          email: "hannah@jadejaguars.gg",
          phone: "+1-555-1301",
        },
        {
          name: "Ian Collins",
          ign: "Jungle",
          role: "Support",
          image: "https://avatar.iran.liara.run/public/59.png",
          email: "ian@jadejaguars.gg",
          phone: "+1-555-1302",
        },
        {
          name: "Julia Bell",
          ign: "Prowler",
          role: "DPS",
          image: "https://avatar.iran.liara.run/public/60.png",
          email: "julia@jadejaguars.gg",
          phone: "+1-555-1303",
        },
      ],
    },
  },
  {
    name: "Topaz Leopards",
    tournamentId: "687d23940670f4d304279292",
    logo: "https://avatar.iran.liara.run/public/61.png",
    teamTag: "TLE",
    email: "contact@topazleopards.gg",
    phone: "+1-555-1400",
    players: {
      create: [
        {
          name: "Kevin Murphy",
          ign: "Spot",
          role: "Captain",
          image: "https://avatar.iran.liara.run/public/62.png",
          email: "kevin@topazleopards.gg",
          phone: "+1-555-1401",
        },
        {
          name: "Lily Watson",
          ign: "Savannah",
          role: "Support",
          image: "https://avatar.iran.liara.run/public/63.png",
          email: "lily@topazleopards.gg",
          phone: "+1-555-1402",
        },
        {
          name: "Max Powell",
          ign: "Climber",
          role: "DPS",
          image: "https://avatar.iran.liara.run/public/64.png",
          email: "max@topazleopards.gg",
          phone: "+1-555-1403",
        },
      ],
    },
  },
  {
    name: "Amber Cheetahs",
    tournamentId: "687d23940670f4d304279292",
    logo: "https://avatar.iran.liara.run/public/65.png",
    teamTag: "ACH",
    email: "contact@ambercheetahs.gg",
    phone: "+1-555-1500",
    players: {
      create: [
        {
          name: "Nora Hughes",
          ign: "Speed",
          role: "Captain",
          image: "https://avatar.iran.liara.run/public/66.png",
          email: "nora@ambercheetahs.gg",
          phone: "+1-555-1501",
        },
        {
          name: "Owen Bryant",
          ign: "Flash",
          role: "Support",
          image: "https://avatar.iran.liara.run/public/67.png",
          email: "owen@ambercheetahs.gg",
          phone: "+1-555-1502",
        },
        {
          name: "Paige Alexander",
          ign: "Sprint",
          role: "DPS",
          image: "https://avatar.iran.liara.run/public/68.png",
          email: "paige@ambercheetahs.gg",
          phone: "+1-555-1503",
        },
      ],
    },
  },
  {
    name: "Onyx Pumas",
    tournamentId: "687d23940670f4d304279292",
    logo: "https://avatar.iran.liara.run/public/69.png",
    teamTag: "OPU",
    email: "contact@onyxpumas.gg",
    phone: "+1-555-1600",
    players: {
      create: [
        {
          name: "Quentin Russell",
          ign: "Ghost",
          role: "Captain",
          image: "https://avatar.iran.liara.run/public/70.png",
          email: "quentin@onyxpumas.gg",
          phone: "+1-555-1601",
        },
        {
          name: "Rachel Griffin",
          ign: "Spirit",
          role: "Support",
          image: "https://avatar.iran.liara.run/public/71.png",
          email: "rachel@onyxpumas.gg",
          phone: "+1-555-1602",
        },
        {
          name: "Steve Foster",
          ign: "Mountain",
          role: "DPS",
          image: "https://avatar.iran.liara.run/public/72.png",
          email: "steve@onyxpumas.gg",
          phone: "+1-555-1603",
        },
      ],
    },
  },
  {
    name: "Ivory Cobras",
    tournamentId: "687d23940670f4d304279292",
    logo: "https://avatar.iran.liara.run/public/73.png",
    teamTag: "ICO",
    email: "contact@ivorycobras.gg",
    phone: "+1-555-1700",
    players: {
      create: [
        {
          name: "Tara Simmons",
          ign: "Viper",
          role: "Captain",
          image: "https://avatar.iran.liara.run/public/74.png",
          email: "tara@ivorycobras.gg",
          phone: "+1-555-1701",
        },
        {
          name: "Uriel Perry",
          ign: "Hood",
          role: "Support",
          image: "https://avatar.iran.liara.run/public/75.png",
          email: "uriel@ivorycobras.gg",
          phone: "+1-555-1702",
        },
        {
          name: "Vivian Long",
          ign: "Strike",
          role: "DPS",
          image: "https://avatar.iran.liara.run/public/76.png",
          email: "vivian@ivorycobras.gg",
          phone: "+1-555-1703",
        },
      ],
    },
  },
  {
    name: "Scarlet Vipers",
    tournamentId: "687d23940670f4d304279292",
    logo: "https://avatar.iran.liara.run/public/77.png",
    teamTag: "SVI",
    email: "contact@scarletvipers.gg",
    phone: "+1-555-1800",
    players: {
      create: [
        {
          name: "Wade Coleman",
          ign: "Fangs",
          role: "Captain",
          image: "https://avatar.iran.liara.run/public/78.png",
          email: "wade@scarletvipers.gg",
          phone: "+1-555-1801",
        },
        {
          name: "Xena Barnes",
          ign: "Venom",
          role: "Support",
          image: "https://avatar.iran.liara.run/public/79.png",
          email: "xena@scarletvipers.gg",
          phone: "+1-555-1802",
        },
        {
          name: "Yosef Fisher",
          ign: "Hiss",
          role: "DPS",
          image: "https://avatar.iran.liara.run/public/80.png",
          email: "yosef@scarletvipers.gg",
          phone: "+1-555-1803",
        },
      ],
    },
  },
  {
    name: "Violet Scorpions",
    tournamentId: "687d23940670f4d304279292",
    logo: "https://avatar.iran.liara.run/public/81.png",
    teamTag: "VSC",
    email: "contact@violetscorpions.gg",
    phone: "+1-555-1900",
    players: {
      create: [
        {
          name: "Zara Henderson",
          ign: "Stinger",
          role: "Captain",
          image: "https://avatar.iran.liara.run/public/82.png",
          email: "zara@violetscorpions.gg",
          phone: "+1-555-1901",
        },
        {
          name: "Aaron Sanders",
          ign: "Pincer",
          role: "Support",
          image: "https://avatar.iran.liara.run/public/83.png",
          email: "aaron@violetscorpions.gg",
          phone: "+1-555-1902",
        },
        {
          name: "Brianna Curtis",
          ign: "Arachnid",
          role: "DPS",
          image: "https://avatar.iran.liara.run/public/84.png",
          email: "brianna@violetscorpions.gg",
          phone: "+1-555-1903",
        },
      ],
    },
  },
  {
    name: "Indigo Raptors",
    tournamentId: "687d23940670f4d304279292",
    logo: "https://avatar.iran.liara.run/public/85.png",
    teamTag: "IRA",
    email: "contact@indigoraptors.gg",
    phone: "+1-555-2100",
    players: {
      create: [
        {
          name: "Carter Pearson",
          ign: "Veloci",
          role: "Captain",
          image: "https://avatar.iran.liara.run/public/86.png",
          email: "carter@indigoraptors.gg",
          phone: "+1-555-2101",
        },
        {
          name: "Diana Harper",
          ign: "RaptorX",
          role: "Support",
          image: "https://avatar.iran.liara.run/public/87.png",
          email: "diana@indigoraptors.gg",
          phone: "+1-555-2102",
        },
        {
          name: "Eli George",
          ign: "Clever",
          role: "DPS",
          image: "https://avatar.iran.liara.run/public/88.png",
          email: "eli@indigoraptors.gg",
          phone: "+1-555-2103",
        },
      ],
    },
  },
  {
    name: "Magenta Hornets",
    tournamentId: "687d23940670f4d304279292",
    logo: "https://avatar.iran.liara.run/public/89.png",
    teamTag: "MHO",
    email: "contact@magentahornets.gg",
    phone: "+1-555-2200",
    players: {
      create: [
        {
          name: "Fiona West",
          ign: "Buzzer",
          role: "Captain",
          image: "https://avatar.iran.liara.run/public/90.png",
          email: "fiona@magentahornets.gg",
          phone: "+1-555-2201",
        },
        {
          name: "Gavin Lynch",
          ign: "Swarm",
          role: "Support",
          image: "https://avatar.iran.liara.run/public/91.png",
          email: "gavin@magentahornets.gg",
          phone: "+1-555-2202",
        },
        {
          name: "Holly Berry",
          ign: "Sting",
          role: "DPS",
          image: "https://avatar.iran.liara.run/public/92.png",
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