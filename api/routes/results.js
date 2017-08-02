import mysql from 'promise-mysql'
import {parse, format} from 'date-fns'
import config from '../../src/config'

const pool = mysql.createPool({
  connectionLimit: 10,
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName
})

const tranformQuery = (query) => {
  return Object.keys(query).map((key) => {
    const {...all} = query[key]
    return all
  })
}

const getRaces = async () => {
  try {
    const connection = await pool.getConnection()
    const data = await connection.query(`SELECT r.id, r.date, c.competition, e.edition
      FROM race as r
      join competition as c on r.competition_id = c.id
      join edition as e on r.edition_id = e.id
      ORDER BY 2 DESC;`)
    pool.releaseConnection(connection)
    return tranformQuery(data).map(({id, date, competition, edition}) => {
      return {
        id: `${id}`,
        year: format(parse(date), 'YYYY'),
        competition,
        edition
      }
    })
  } catch (error) {
    throw error
  }
}

const getClasses = () => {
  return [{
    name: 'Women and Men',
    id: null
  }, {
    name: 'Women only',
    id: 'F'
  }, {
    name: 'Men only',
    id: 'M'
  }]
}

const getRace = async ({raceId, genderClass = null}) => {
  try {
    const connection = await pool.getConnection()
    const query = `SELECT a.last_name, a.first_name, g.gender_code, sr.order, sport.name, s2p.time, p.finishtime, rw.reward, r.id, r.date, a.xtri_id
      FROM participation as p
      join race as r on p.race_id = r.id
      join athlete as a on p.athlete_id = a.xtri_id
      join segment_participation as s2p on p.id=s2p.participation_id
      join reward as rw on p.reward_id=rw.id
      join segment_race as sr on sr.segment_race_id=s2p.segment_race_id 
      join sport as sport on sport.sport_id=sr.sport_id
      join course as c on c.course_id=s2p.course_id
      join gender as g on g.id=a.gender_id
      WHERE ${genderClass ? `g.gender_code='${genderClass}' and` : ''} r.id=${raceId} order by 7,4;`
    const data = await connection.query(query).reduce((results, {xtri_id: xtriId, first_name, last_name, gender_code, finishtime, reward, id, ...rest}) => {
      if (results.some((res) => res.xtriId === xtriId)) {
        return results.map((res) => {
          if (res.xtriId === xtriId) {
            return {
              ...res,
              segments: [
                ...res.segments,
                {
                  ...rest
                }
              ]
            }
          }
          return res
        })
      }
      return [...results, {
        xtriId,
        first_name,
        last_name,
        gender_code,
        finishtime,
        reward,
        segments: [{
          ...rest
        }]
      }]
    }, [])
    pool.releaseConnection(connection)
    return tranformQuery(data)
  } catch (error) {
    throw error
  }
}

function read (req, res) {
  const {query: {raceId, genderClass}} = req
  Promise.all([
    getRaces(),
    getClasses(),
    raceId ? getRace({raceId: raceId, genderClass: genderClass}) : Promise.resolve(null)
  ])
  .then(([races, classes, results]) => {
    const params = {
      raceId,
      genderClass
    }
    res.send({races, classes, results, params})
  })
  .catch((error) => {
    res.status(403).send({error: error.message})
  })
}

export default {
  read
}
