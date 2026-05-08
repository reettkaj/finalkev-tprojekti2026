import {findTsqByUserId,addTsq,findTsqById} from "../models/tsq-model.js";

const getTsq = async (req, res) => {
  try {
    const tsq = await findTsqByUserId(req.params.id);

    if (!tsq || Object.keys(tsq).length === 0) {
      return res.status(404).json({ error: "tsq not found" });
    }

    res.json(tsq);

  } catch (error) {
    console.error("getTsq", error);
    res.status(500).json({ error: "server error" });
  }
};

const postTsq = async (req, res) => {
  try {
    const { user_id, answers } = req.body;

    if (!user_id || !Array.isArray(answers)) {
      return res.status(400).json({ error: "invalid data" });
    }

    if (answers.length !== 10) {
      return res.status(400).json({ error: "TSQ must have 10 answers" });
    }

    // 🔑 varmista ettei tule out-of-range dataa
    for (const a of answers) {
      if (typeof a.question !== "number" || ![0, 1].includes(a.answer)) {
        return res.status(400).json({ error: "invalid answer format" });
      }
    }

    // map turvallisesti
    const mapped = {
      q1: 0, q2: 0, q3: 0, q4: 0, q5: 0,
      q6: 0, q7: 0, q8: 0, q9: 0, q10: 0
    };

    answers.forEach(a => {
      mapped[`q${a.question}`] = a.answer;
    });

    const points = answers.reduce((sum, a) => sum + a.answer, 0);

    const tsqData = {
      user_id,
      points,
      ...mapped
    };

    const result = await addTsq(tsqData);

    res.status(201).json({
      message: "TSQ saved",
      id: result.id,
      points
    });

  } catch (error) {
    console.error("postTsq", error);
    res.status(500).json({ error: "server error" });
  }
};

const getTsqById = async (req, res) => {
  try {
    const tsq = await findTsqById(req.params.id);

    if (!tsq || Object.keys(tsq).length === 0) {
      return res.status(404).json({ error: "tsq not found" });
    }

    res.json(tsq);

  } catch (error) {
    console.error("getTsqById", error);
    res.status(500).json({ error: "server error" });
  }
};


export {getTsq,postTsq,getTsqById};