import React from 'react';
import {Image} from "@nextui-org/image";
import {Card, CardBody, CardHeader} from "@nextui-org/react";
import NextImage from "next/image";

interface RecommendationComponentProps {
  recommendation: string;
}

const RecommendationComponent: React.FC<RecommendationComponentProps> = ({ recommendation }) => {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 font-sans">
        <div className="flex flex-col items-center justify-content-center">
            <Image
                as={NextImage}
                width={300}
                height={200}
                src="/static/images/medium-cover.jpg"
                alt="NextUI hero Image"
            />
            <h1 className="text-center mt-2 mb-2 text-2xl"><strong>Interstellar</strong> (2014)</h1>
            <Card className="mt-2">
                <CardBody>
                    <p className="text-center italic">We are recommending this movie to you because you'll LIKE IT.</p>
                </CardBody>
            </Card>
            <Card className="mt-2 mb-0 max-w-prose">
                <CardHeader className="font-bold">
                    <h1>Description</h1>
                </CardHeader>
                    <CardBody>
                        <p className="">The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.</p>
                    </CardBody>
            </Card>
        </div>
    </section>
  );
};

export default RecommendationComponent;
