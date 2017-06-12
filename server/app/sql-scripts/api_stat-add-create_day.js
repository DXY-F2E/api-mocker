db.apistats.aggregate(
    [
        { "$addFields": {
            "createDay": { $dateToString: { format: "%Y-%m-%d", date: "$createTime" } },
        }},
        { "$out": "apistats" }
    ]
)